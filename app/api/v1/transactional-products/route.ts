import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productName = searchParams.get("productName");
    const createdAt = searchParams.get("createdAt");
    const updatedAt = searchParams.get("updatedAt");
    const order = searchParams.get("order") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let filter: any = {};

    if (productName) {
      filter.productName = {
        contains: productName,
      };
    }

    if (createdAt) {
      filter.createdAt = new Date(createdAt);
    }

    if (updatedAt) {
      filter.updatedAt = new Date(updatedAt);
    }

    const products = await prisma.transactionalProducts.findMany({
      where: filter,
      orderBy: { createdAt: order as "asc" | "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return Response.json(
      {
        data: products,
        links: [
          {
            rel: "self",
            href: request.url,
            method: "GET",
          },
          {
            rel: "create",
            href: request.url.replace(
              /transactional-products.*/,
              "transactional-products",
            ),
            method: "POST",
          },
        ],
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload = {
      productName: formData.get("productName"),
      productDescription: formData.get("productDescription"),
    };
    if (!payload.productName) {
      return Response.json(
        { message: "Nome do produto é obrigatório" },
        { status: 400 },
      );
    }
    const product = await prisma.transactionalProducts.create({
      data: {
        productName: String(payload.productName),
        productDescription: String(payload.productDescription) || "",
      },
    });

    return Response.json(
      {
        message: "Novo produto transacional criado",
        data: product,
        links: [
          {
            rel: "self",
            href: `${request.url}/${product.id}`,
            method: "GET",
          },
          {
            rel: "update",
            href: `${request.url}/${product.id}`,
            method: "PATCH",
          },
          {
            rel: "delete",
            href: `${request.url}/${product.id}`,
            method: "DELETE",
          },
        ],
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2002") {
      return Response.json(
        { message: "Este produto transacional já existe" },
        { status: 409 },
      );
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
