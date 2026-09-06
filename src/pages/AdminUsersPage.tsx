import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from '@/i18n';
import { Navbar, Footer, Container, Card, CardBody, Button, Heading, Text } from '@/components';
import { VkmLogo } from '@/assets/VkmLogo';
import { CircuitField } from '@/components/CircuitField';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '@/lib/auth/useAuth';
import { supabase } from '@/lib/supabase';
import './AdminUsersPage.css';

type Role = 'user' | 'admin';

interface ProfileRow {
  id: string;
  email: string;
  role: Role;
  created_at: string;
}

const TABLE = 'profiles';
const COLUMNS = 'id, email, role, created_at';

/** Narrow an untyped PostgREST row to ProfileRow, dropping anything malformed. */
function toProfileRow(raw: unknown): ProfileRow | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.id !== 'string' || typeof row.email !== 'string') return null;
  if (row.role !== 'user' && row.role !== 'admin') return null;
  if (typeof row.created_at !== 'string') return null;
  return { id: row.id, email: row.email, role: row.role, created_at: row.created_at };
}

export default function AdminUsersPage(): JSX.Element {
  const { t, lang } = useTranslation();
  const { user, isAdmin, loading } = useAuth();

  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listFailed, setListFailed] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    // Never touch the table unless the viewer is an admin — a non-admin must
    // not even learn whether the query would have returned anything.
    if (loading || !isAdmin) return;

    let cancelled = false;

    async function load(): Promise<void> {
      setListLoading(true);
      const { data, error } = await supabase
        .from(TABLE)
        .select(COLUMNS)
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error || !Array.isArray(data)) {
        setRows([]);
        setListFailed(true);
      } else {
        setRows(data.map(toProfileRow).filter((row): row is ProfileRow => row !== null));
        setListFailed(false);
      }
      setListLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loading, isAdmin]);

  const changeRole = useCallback(async (id: string, nextRole: Role, previousRole: Role) => {
    setPendingId(id);
    setUpdateFailed(false);
    // Optimistic: the row flips immediately and is rolled back below if the
    // write does not land, so the table never claims a change that did not
    // persist.
    setRows((current) => current.map((row) => (row.id === id ? { ...row, role: nextRole } : row)));

    const { data, error } = await supabase
      .from(TABLE)
      .update({ role: nextRole })
      .eq('id', id)
      .select(COLUMNS);

    // A row filtered out by RLS comes back as success with zero rows, so an
    // empty result counts as a failure just like an error does.
    const saved = !error && Array.isArray(data) && data.length > 0;

    if (!saved) {
      setRows((current) =>
        current.map((row) => (row.id === id ? { ...row, role: previousRole } : row)),
      );
      setUpdateFailed(true);
    }

    setPendingId(null);
  }, []);

  const adminCount = rows.filter((row) => row.role === 'admin').length;

  const dateFormatter = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function formatCreatedAt(value: string): string {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
  }

  function renderBody(): JSX.Element {
    if (loading) {
      return (
        <div className="admin-users__notice" role="status" aria-live="polite" aria-busy="true">
          <Text variant="small">{t('adminUsersLoading')}</Text>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="admin-users__notice">
          <Text>{t('adminUsersForbidden')}</Text>
          <a className="admin-users__link" href="#">
            {t('authBackToSite')}
          </a>
        </div>
      );
    }

    if (listLoading) {
      return (
        <div className="admin-users__notice" role="status" aria-live="polite" aria-busy="true">
          <Text variant="small">{t('adminUsersLoading')}</Text>
        </div>
      );
    }

    if (listFailed) {
      return (
        <div className="admin-users__notice" role="alert">
          <Text>{t('adminUsersError')}</Text>
        </div>
      );
    }

    if (rows.length === 0) {
      return (
        <div className="admin-users__notice">
          <Text>{t('adminUsersEmpty')}</Text>
        </div>
      );
    }

    return (
      <div className="admin-users__scroll">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th scope="col">{t('adminUsersEmail')}</th>
              <th scope="col">{t('adminUsersRole')}</th>
              <th scope="col">{t('adminUsersCreated')}</th>
              <th scope="col">{t('adminUsersActions')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelf = row.id === user?.id;
              const isLastAdmin = row.role === 'admin' && adminCount <= 1;
              const blockDemote = isSelf || isLastAdmin;
              const nextRole: Role = row.role === 'admin' ? 'user' : 'admin';
              const label = row.role === 'admin' ? t('adminUsersDemote') : t('adminUsersPromote');
              const disabled = pendingId !== null || (row.role === 'admin' && blockDemote);
              const reason = row.role === 'admin' && blockDemote ? t('adminUsersLastAdmin') : undefined;

              return (
                <tr key={row.id}>
                  <td>
                    <span className="admin-users__email">{row.email}</span>
                    {isSelf && <span className="admin-users__self">{t('adminUsersSelf')}</span>}
                  </td>
                  <td>
                    <span
                      className={`admin-users__role admin-users__role--${row.role}`}
                    >
                      {row.role === 'admin' ? t('authRoleAdmin') : t('authRoleUser')}
                    </span>
                  </td>
                  <td className="admin-users__date">{formatCreatedAt(row.created_at)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={disabled}
                      title={reason}
                      onClick={() => void changeRole(row.id, nextRole, row.role)}
                    >
                      {label}
                    </Button>
                    {reason && <span className="admin-users__hint">{reason}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <Navbar
        logo={
          <a href="#" className="firm-logo" aria-label={t('firmName')}>
            <VkmLogo className="firm-logo__mark" />
            <span className="firm-logo__tagline">{t('firmTagline')}</span>
          </a>
        }
        links={[
          { label: t('navPractice'), href: '#practice' },
          { label: t('navTeam'), href: '#team' },
          { label: t('navTestimonials'), href: '#testimonials' },
          { label: t('navContact'), href: '#contact' },
        ]}
        cta={
          <div className="navbar__actions">
            <LanguageSwitcher />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                window.location.hash = '#';
              }}
            >
              {t('authBackToSite')}
            </Button>
          </div>
        }
      />

      <main className="admin-users page-ramp page-ramp--short">
        <CircuitField />
        <Container className="admin-users__inner">
          <Card variant="glow" className="admin-users__card">
            <CardBody>
              <div className="admin-users__head">
                <Text variant="overline">{t('navAdminUsers')}</Text>
                <Heading level={2}>{t('adminUsersTitle')}</Heading>
                <Text variant="small">{t('adminUsersSubtitle')}</Text>
              </div>

              {updateFailed && (
                <p className="admin-users__error" role="alert">
                  {t('adminUsersUpdateError')}
                </p>
              )}

              {renderBody()}
            </CardBody>
          </Card>
        </Container>
      </main>

      <Footer
        logo={
          <div className="footer-brand">
            <VkmLogo className="footer-brand__mark" title={t('firmName')} />
          </div>
        }
        columns={[]}
        bottom={<p>{t('footerCopyright')}</p>}
      />
    </>
  );
}
