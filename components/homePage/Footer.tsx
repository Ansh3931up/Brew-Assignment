'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Task Tracker
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Organize your tasks, stay productive, and get things done.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Get Started</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start organizing your tasks today!
            </p>
            <Link
              href="/signup"
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Task Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

