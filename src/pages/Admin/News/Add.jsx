import React from 'react'
import FormPost from './components/FormPost'

const Add = () => {
  const handleSubmit = async (data) => {
    // await productService.create(data);
    // Redirect hoặc toast
  };

  return (
    <div><FormPost onSubmit={handleSubmit} mode="add"/></div>
  )
}

export default Add