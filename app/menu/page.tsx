import { redirect } from 'next/navigation'

export default function MenuPage() {
  // Redirect Menu to Products page
  redirect('/products')
}
