import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EditableText } from './EditableText';
import en from '@/i18n/locales/en';

/**
 * These pin the behaviour of an EMPTIED field, which is the state that cost a
 * line of production copy.
 *
 * An admin cleared the hero's second title line in edit mode. The component
 * rendered its value and nothing else, so the element collapsed to a zero-size
 * box: no text, no padding, nothing to click or tab to. The copy could not be
 * put back from the page at all — it had to be restored in the database, and
 * `site_content` grants `anon` nothing but SELECT, so that meant an admin
 * session and a SQL client.
 *
 * The two things that have to stay true: an admin gets something to click, and
 * a visitor still gets nothing — emptying a line has to keep meaning "this line
 * is empty" on the public site.
 */

const canEdit = vi.hoisted(() => ({ value: true }));
const value = vi.hoisted(() => ({ text: '' }));
const saveOverride = vi.hoisted(() => vi.fn(async () => ({ error: null })));

vi.mock('@/lib/edit-mode', () => ({
  useEditMode: () => ({ canEdit: canEdit.value }),
}));

vi.mock('@/i18n', () => ({
  useTranslation: () => ({
    lang: 'en',
    t: (key: string) => (key === 'demoKey' ? value.text : (en as Record<string, string>)[key] ?? key),
  }),
}));

vi.mock('@/lib/content/useContentEditor', () => ({
  useContentEditor: () => ({ saveOverride, saving: false }),
}));

describe('EditableText, emptied', () => {
  beforeEach(() => {
    canEdit.value = true;
    value.text = '';
    saveOverride.mockClear();
  });

  it('leaves an admin a placeholder to click when the value is empty', () => {
    render(<EditableText tKey="demoKey" as="p" />);

    const target = screen.getByRole('button');
    expect(target).toHaveTextContent(en.editEmpty);
    expect(target.className).toContain('editable-text--empty');
  });

  it('opens the editor from that placeholder, so the copy can be put back', async () => {
    const user = userEvent.setup();
    render(<EditableText tKey="demoKey" as="p" />);

    await user.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');

    await user.type(input, 'Legal Counsel');
    await user.tab();

    expect(saveOverride).toHaveBeenCalledWith('demoKey', 'en', 'Legal Counsel');
  });

  it('treats whitespace as empty — a space is not a click target either', () => {
    value.text = '   ';
    render(<EditableText tKey="demoKey" as="p" />);

    expect(screen.getByRole('button')).toHaveTextContent(en.editEmpty);
  });

  it('shows a visitor nothing at all', () => {
    canEdit.value = false;
    const { container } = render(<EditableText tKey="demoKey" as="p" />);

    expect(container.textContent).toBe('');
    expect(container.querySelector('.editable-text__placeholder')).toBeNull();
  });

  it('leaves a non-empty value alone', () => {
    value.text = 'Legal Counsel';
    render(<EditableText tKey="demoKey" as="p" />);

    const target = screen.getByRole('button');
    expect(target).toHaveTextContent('Legal Counsel');
    expect(target.className).not.toContain('editable-text--empty');
  });
});
