import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import './ContactForm.css';

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone: string; message: string }) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit?.({ name, email, phone, message });
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <Input
          label={t('contactFormName')}
          placeholder={t('contactFormNamePlaceholder')}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label={t('contactFormEmail')}
          type="email"
          placeholder={t('contactFormEmailPlaceholder')}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Input
        label={t('contactFormPhone')}
        type="tel"
        placeholder={t('contactFormPhonePlaceholder')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Textarea
        label={t('contactFormMessage')}
        placeholder={t('contactFormMessagePlaceholder')}
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" size="lg">
        {t('contactFormSubmit')}
      </Button>
    </form>
  );
}
