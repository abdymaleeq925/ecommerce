interface SubcategoriesProps {
  params: Promise<{
    category: string,
    subcategory: string
  }>
}

const Page = async ({ params }: SubcategoriesProps) => {
  const { category, subcategory } = await params;
  return (
    <div>Category: {category} {subcategory }</div>
  )
}

export default Page