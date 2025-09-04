import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}