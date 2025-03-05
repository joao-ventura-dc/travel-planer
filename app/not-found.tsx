import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="space-y-6">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[500px] mx-auto">
          We couldn't find the property you're looking for. It might have been removed or doesn't exist.
        </p>
        <Link 
          href="/" 
          className="button button-primary inline-block"
        >
          Return to Properties
        </Link>
      </div>
    </div>
  )
}

