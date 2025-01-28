"use client";
import Head from 'next/head'
export default function lowerFooter() {
  return (
    <div className=" bg-white">
      <Head>
        <title>Transform Your Legal Experience</title>
        <meta name="description" content="Legal services platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Ready to Transform Your Legal Experience?
          </h1>
          
          <p className="text-xl md:text-2xl text-black mb-12">
            Join thousands of satisfied users who trust LawConnect for their legal needs.
          </p>
          
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-lg font-semibold rounded-lg hover:bg-black hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-1">
            Get Started
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          
          
        </div>
      </main>
    </div>
  )
}