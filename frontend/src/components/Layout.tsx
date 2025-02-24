import * as React from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Link } from '@tanstack/react-router'
import { useTranslation } from '@/lib/translations'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()
  const [language, setLanguage] = React.useState<'zh' | 'en'>('zh')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <NavigationMenu.Root className="relative flex flex-1 items-center justify-between">
            <NavigationMenu.List className="flex items-center gap-6">
              <NavigationMenu.Item>
                <Link to="/" className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  APPCopier
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  {t('nav.products')}
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/upload" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  {t('nav.upload')}
                </Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === 'zh' ? 'EN' : '中文'}
              </button>
              <Link
                to="/auth/login"
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t('nav.login')}
              </Link>
            </div>
          </NavigationMenu.Root>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
      <footer className="mt-auto border-t bg-muted/50">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © 2024 APPCopier. {t('footer.rights')}
        </div>
      </footer>
    </div>
  )
}
