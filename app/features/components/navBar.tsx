import React from 'react'

function NavBar() {
  return (
   <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">MyApp</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </a>
            <a href="/courses" className="text-gray-700 hover:text-blue-600 transition">
              Courses
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
   
<button
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/features/auth/pages/login";
  }}
  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
>
  Logout
</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
