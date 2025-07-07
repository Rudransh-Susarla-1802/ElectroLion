import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'
import { sendRandomPromoCodeEmail } from './utils/sendRandomPromoCodeEmail'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      setMessage('')
      setTimeout(() => setError(''), 3000)
      return
    }

    try {
      // Send random promo code email
      await sendRandomPromoCodeEmail(email)
      
      setError('')
      setMessage('Subscribed successfully! Check your email for a special promo code! 🎉')
      setEmail('')
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      console.error('Failed to send promo code email:', error)
      setError('Subscription failed. Please try again.')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <footer className="bg-[#0B192C] font-mono text-white mt-4 rounded-md py-8 px-6">
      <div className="grid grid-cols-[1fr_0.8fr_0.5fr_1fr] gap-8 max-w-7xl mx-auto">
        
        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About Us</h3>
          <p className="text-sm text-gray-300">
          We are an electronics e-commerce store offering quality gadgets, appliances, and accessories at great prices. Enjoy secure payments, fast delivery, and reliable customer support for a smooth shopping experience.
          </p>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="text-sm text-gray-300 space-y-1 mb-4">
            <li>Email: support@example.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: 123 Tech Street, Bengaluru</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex flex-row items-center space-x-4">
            <a className="hover:bg-blue-500" href="https://www.facebook.com/" target="_blank" rel="noreferrer"><Facebook /></a>
            <a className="hover:bg-blue-500" href="https://x.com/" target="_blank" rel="noreferrer"><Twitter /></a>
            <a className="hover:bg-blue-500" href="https://www.linkedin.com/feed/" target="_blank" rel="noreferrer"><Linkedin /></a>
            <a className="hover:bg-blue-500" href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram /></a>
            <a className="hover:bg-blue-500" href="https://www.youtube.com/" target="_blank" rel="noreferrer"><Youtube /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link className='text-red-500' to="/logout">Logout</Link></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <label htmlFor="email" className="block text-lg font-semibold mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email to get Promocodes"
            className="w-full mt-2 px-4 py-2 text-xs rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubscribe}
            className="mt-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white px-4 py-2 rounded-md font-semibold shadow-md transition duration-300 ease-in-out"
          >
            Subscribe
          </button>

          {error && <div className="text-red-500 mt-2">{error}</div>}
          {message && <div className="text-green-500 mt-2">{message}</div>}
        </div>
      </div>
    </footer>
  )
}

export default Footer
