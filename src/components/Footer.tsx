import Link from "next/link";

const SHOP_LINKS = [
  { label: "New Arrivals", href: "/shop/new" },
  { label: "Eyeglasses", href: "/shop/eyeglasses" },
  { label: "Sunglasses", href: "/shop/sunglasses" },
  { label: "Limited Editions", href: "/shop/limited" },
];

const COMPANY_LINKS = [
  { label: "About Vision", href: "/about" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Press", href: "/press" },
];

const SUPPORT_LINKS = [
  { label: "Find Your Fit", href: "/fit-guide" },
  { label: "Lens Guide", href: "/lens-guide" },
  { label: "Returns", href: "/returns" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="section-wrap">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <Link href="/" className="footer-logo" aria-label="Vision home">
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  background: "var(--orange)",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
                aria-hidden="true"
              />
              VISION
            </Link>
            <p className="footer-tagline">
              Premium futuristic eyewear crafted for those who see differently.
            </p>
            <div className="footer-social" aria-label="Social media links">
              <a
                href="https://instagram.com"
                className="footer-social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="footer-social-link"
                aria-label="X / Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4L20 20M20 4L4 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                className="footer-social-link"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="footer-col-head">Shop</p>
            <ul className="footer-links" role="list">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-col-head">Company</p>
            <ul className="footer-links" role="list">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="footer-col-head">Support</p>
            <ul className="footer-links" role="list">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Vision Eyewear. All rights reserved.
          </p>
          <div className="footer-accent-line" aria-hidden="true" />
          <nav className="footer-legal" aria-label="Legal links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
