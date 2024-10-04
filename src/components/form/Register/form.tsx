import React, { useState } from "react";
import styles from "../form.module.css"; 

interface FormValues {
  name: string;
  email: string;
  password: string;
  age: string;
  phone: string;
}

const FormComponent: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    age: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormValues> = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!formValues.age) newErrors.age = "Age is required";
    if(parseInt(formValues.age)<15) newErrors.age = "Age should be greater than or equal to 15"
    if (!formValues.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Process form submission
      console.log("Form Submitted", formValues);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
         data-test="input-name"
          type="text"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          className={styles.inputField}
        />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          className={styles.inputField}
        />
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          className={styles.inputField}
        />
        {errors.password && <p className={styles.errorText}>{errors.password}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="age" className={styles.label}>Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formValues.age}
          onChange={handleChange}
          className={styles.inputField}
        />
        {errors.age && <p className={styles.errorText}>{errors.age}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.label}>Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
          className={styles.inputField}
        />
        {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
      </div>

      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
};

export default FormComponent;
