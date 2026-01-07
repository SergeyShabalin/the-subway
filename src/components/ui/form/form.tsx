import React, { FormEvent, useState } from 'react';

import styles from './Form.module.css';
import { Input } from '@components/ui'

export interface FormField {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  validation?: (value: string) => string | undefined;
  customRender?: (value: string, onChange: (value: string) => void) => JSX.Element;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitText?: string;
  title?: string;
  className?: string;
}

const Form: React.FC<FormProps> = ({
                                     fields,
                                     onSubmit,
                                     submitText = "Отправить",
                                     title,
                                     className = ''
                                   }) => {
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] = useState<Record<string, string>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.name] || '';

      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} обязателен для заполнения`;
        return;
      }

      if (field.validation) {
        const validationError = field.validation(value);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  // Убрать handleSelectChange - он не нужен для customRender

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      // Очистка формы после отправки
      setFormData(initialFormData);
    }
  };

  return (
    <form className={`${styles.form} ${className}`} onSubmit={handleSubmit} noValidate>
      {title && <h2 className={styles.title}>{title}</h2>}

      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          {field.customRender ? (
            <div>
              <label className={styles.selectLabel}>{field.label}</label>
              {field.customRender(
                formData[field.name] || '',
                (value: string) => handleChange(field.name, value) // Просто передаем значение
              )}
            </div>
          ) : (
            <Input
              placeholder={field.placeholder || field.label}
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              required={field.required}
            />
          )}
          {errors[field.name] && (
            <span className={styles.error}>{errors[field.name]}</span>
          )}
        </div>
      ))}

      <button type="submit" className={styles.submitButton}>
        {submitText}
      </button>
    </form>
  );
};

export { Form };