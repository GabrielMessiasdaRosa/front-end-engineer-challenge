import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await prisma.transactionalProducts.findUnique({
      where: { id: id },
    });

    if (!product) {
      return Response.json(
        { message: "Produto transacional não encontrado" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        data: product,
        links: [
          {
            rel: "self",
            href: request.url,
            method: "GET",
          },
          {
            rel: "update",
            href: request.url,
            method: "PATCH",
          },
          {
            rel: "delete",
            href: request.url,
            method: "DELETE",
          },
        ],
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      productName: body.productName,
      productDescription: body.productDescription,
    };
    const product = await prisma.transactionalProducts.findUnique({
      where: { id: id },
    });

    if (!product) {
      return Response.json(
        { message: "Produto transacional não encontrado" },
        { status: 404 },
      );
    }

    if (!payload.productName && !payload.productDescription) {
      return Response.json(
        { message: "Nenhum campo para atualizar foi fornecido" },
        { status: 400 },
      );
    }

    const updatedProduct = await prisma.transactionalProducts.update({
      where: { id: id },
      data: {
        productName: payload.productName
          ? String(payload.productName)
          : product.productName,
        productDescription: payload.productDescription
          ? String(payload.productDescription)
          : product.productDescription,
      },
    });

    return Response.json(
      {
        message: "Produto transacional atualizado com sucesso",
        data: updatedProduct,
        links: [
          {
            rel: "self",
            href: request.url,
            method: "PATCH",
          },
          {
            rel: "get",
            href: request.url,
            method: "GET",
          },
          {
            rel: "delete",
            href: request.url,
            method: "DELETE",
          },
        ],
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return Response.json(
        { message: "Este nome de produto já está em uso" },
        { status: 409 },
      );
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.transactionalProducts.delete({
      where: { id: id },
    });
    return Response.json(
      {
        message: "Produto transacional deletado com sucesso",
        links: [
          {
            rel: "create",
            href: request.url.replace(
              /transactional-products\/.*/,
              "transactional-products",
            ),
            method: "POST",
          },
          {
            rel: "list",
            href: request.url.replace(
              /transactional-products\/.*/,
              "transactional-products",
            ),
            method: "GET",
          },
        ],
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return Response.json(
        { message: "Produto transacional não encontrado" },
        { status: 404 },
      );
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
