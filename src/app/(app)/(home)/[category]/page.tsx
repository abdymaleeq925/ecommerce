interface CategoriesProps {
  params: Promise<{
    category: string
  }>
}

const Page = async ({ params }: CategoriesProps) => {
  const { category } = await params;
  return (
    <div>Category: {category}</div>
  )
}

export default Page