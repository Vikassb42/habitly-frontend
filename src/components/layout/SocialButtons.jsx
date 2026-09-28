function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 21.99c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.99Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 14.09A5.86 5.86 0 0 1 6.23 12c0-.72.12-1.42.31-2.09V7.38H3.3A9.99 9.99 0 0 0 2 12c0 1.62.39 3.16 1.3 4.62l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.88c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 2.97 14.63 2 12 2a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 7.6 9.46 5.88 12 5.88Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.34-3.14-2.58-1.71-2.48-3.02-7.01-1.26-10.02a4.9 4.9 0 0 1 4.13-2.51c1.29-.02 2.51.87 3.28.87.78 0 2.25-1.08 3.8-.92.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.27-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.42 1.44-1.37 2.83ZM15.5 5.06c.71-.86 1.18-2.07 1.05-3.27-1.02.04-2.25.68-2.98 1.54-.65.75-1.22 1.96-1.07 3.13 1.14.09 2.29-.58 3-1.4Z" />
    </svg>
  );
}

export default function SocialButtons({ label = "Continue with" }) {
  const handleComingSoon = () => {
    window.alert("Coming soon!");
  };

  return (
    <div className="space-y-2.5">
      {/* Google */}
      <button
        type="button"
        onClick={handleComingSoon}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-black/5"
      >
        <GoogleIcon />
        {label} Google
      </button>

      {/* Apple */}
      <button
        type="button"
        onClick={handleComingSoon}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-ink-700 transition-colors hover:bg-ink-900"
      >
        <AppleIcon />
        {label} Apple
      </button>
    </div>
  );
}