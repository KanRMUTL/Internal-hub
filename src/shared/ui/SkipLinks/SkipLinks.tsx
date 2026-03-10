import { cva, type VariantProps } from 'class-variance-authority'

const skipLinksContainerVariants = cva('absolute -top-[100px] left-0 z-[9999] flex gap-1')

const skipLinkVariants = cva([
  'absolute -top-[100px] left-4 bg-[#008472] text-white py-2 px-4 rounded-md no-underline font-medium text-sm shadow-lg transition-all duration-150 ease-out z-[9999]',
  'focus:static focus:top-auto focus:translate-y-0 focus:outline-[2px] focus:outline-white focus:outline-offset-2',
  'focus:hover:bg-[#1b7ab8] focus:hover:-translate-y-[1px] focus:hover:shadow-xl',
  'dark:bg-white dark:text-[#0a0a0a] dark:focus:hover:bg-gray-100',
])

interface SkipLinkItem {
  href: string
  label: string
}

interface SkipLinksProps {
  links: SkipLinkItem[]
}

const SkipLinks = ({ links }: SkipLinksProps) => {
  return (
    <div className={skipLinksContainerVariants()}>
      {links.map((link) => (
        <a key={link.href} href={link.href} className={skipLinkVariants()}>
          {link.label}
        </a>
      ))}
    </div>
  )
}

export default SkipLinks
