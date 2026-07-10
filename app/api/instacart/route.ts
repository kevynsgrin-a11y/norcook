import { getAllRecipes } from '@/lib/data/recipes'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Instacart "Create a Recipe Page" integration (mocked).
 *
 * In production this would POST the structured payload below to:
 *   https://connect.instacart.com/idp/v1/products/recipe
 *   Authorization: Bearer <INSTACART_API_KEY>
 * and return the `products_link_url` Instacart responds with. Here we build the
 * exact payload shape and return a mocked shoppable URL.
 */

interface InstacartLineItem {
  name: string
  quantity: number
  unit: string
  display_text: string
}

interface InstacartRecipePayload {
  title: string
  image_url: string
  link_type: 'recipe'
  author: string
  servings: number
  cooking_time: number
  ingredients: InstacartLineItem[]
  landing_page_configuration: {
    partner_linkback_url: string
    enable_pantry_items: boolean
  }
}

export async function POST(req: NextRequest) {
  const { recipeId } = (await req.json()) as { recipeId?: string }
  const recipe = getAllRecipes().find((r) => r.id === recipeId)

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
  }

  const origin = req.nextUrl.origin
  const imageUrl = recipe.posterUrl.startsWith('http')
    ? recipe.posterUrl
    : `${origin}${recipe.posterUrl}`

  const line_items: InstacartLineItem[] = recipe.ingredients.map((ing) => ({
    name: ing.name,
    quantity: ing.amount,
    unit: ing.unit,
    display_text: `${ing.quantity} ${ing.name}`,
  }))

  const payload: InstacartRecipePayload = {
    title: recipe.title,
    image_url: imageUrl,
    link_type: 'recipe',
    author: recipe.creator.name,
    servings: recipe.servings,
    cooking_time: recipe.totalTimeMinutes,
    ingredients: line_items,
    landing_page_configuration: {
      partner_linkback_url: `${origin}/recipe/${recipe.slug}`,
      enable_pantry_items: true,
    },
  }

  // --- Mocked Instacart response -------------------------------------------
  // const res = await fetch('https://connect.instacart.com/idp/v1/products/recipe', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${process.env.INSTACART_API_KEY}`,
  //   },
  //   body: JSON.stringify(payload),
  // })
  // const data = await res.json()
  // return NextResponse.json({ products_link_url: data.products_link_url })

  const mockedUrl = `https://www.instacart.com/store/recipes/${recipe.slug}?utm_source=norcook`

  return NextResponse.json({
    products_link_url: mockedUrl,
    payload,
    line_item_count: line_items.length,
  })
}
