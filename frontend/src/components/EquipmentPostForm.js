import React, { useState } from 'react';
import './EquipmentPostForm.css';

function EquipmentPostForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send form data to backend or update state
  };

  return (
    <div className="equipment-post-form-container">
      <h2>Post Equipment for Rent</h2>
      {submitted ? (
        <div className="success-message">Your equipment has been posted!</div>
      ) : (
        <form className="equipment-post-form" onSubmit={handleSubmit}>
          <label>
            Equipment Name
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </label>
          <label>
            Price per day (৳)
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
          </label>
          <label>
            Image
            <input type="file" name="image" accept="image/*" onChange={handleChange} required />
          </label>
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
          <button type="submit">Post Equipment</button>
        </form>
      )}
    </div>
  );
}

export default EquipmentPostForm;
