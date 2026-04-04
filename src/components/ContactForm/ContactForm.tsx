import { type FormEvent, useState } from 'react';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import './ContactForm.css';

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone: string; message: string }) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
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
          label="Full Name"
          placeholder="John Smith"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Input
        label="Phone"
        type="tel"
        placeholder="(555) 123-4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Textarea
        label="How can we help?"
        placeholder="Briefly describe your legal matter..."
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" size="lg">
        Schedule Consultation
      </Button>
    </form>
  );
}
