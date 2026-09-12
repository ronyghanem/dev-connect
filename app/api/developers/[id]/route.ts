import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Developer from "@/models/Developer";
import { requireAdmin } from "@/lib/isAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type DeveloperInput = {
  name?: unknown;
  role?: unknown;
  bio?: unknown;
  image?: unknown;
};

type ValidatedDeveloperData = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

type ValidationResult =
  | {
      data: ValidatedDeveloperData;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: string;
    };

function validateDeveloperInput(
  body: DeveloperInput
): ValidationResult {
  if (!body || typeof body !== "object") {
    return {
      error: "Request body must be a valid object.",
    };
  }

  if (typeof body.name !== "string") {
    return {
      error: "Name must be a string.",
    };
  }

  if (typeof body.role !== "string") {
    return {
      error: "Role must be a string.",
    };
  }

  if (typeof body.bio !== "string") {
    return {
      error: "Bio must be a string.",
    };
  }

  if (
    body.image !== undefined &&
    body.image !== null &&
    typeof body.image !== "string"
  ) {
    return {
      error: "Image must be a string.",
    };
  }

  const name = body.name.trim();
  const role = body.role.trim();
  const bio = body.bio.trim();
  const image =
    typeof body.image === "string"
      ? body.image.trim()
      : "";

  if (!name) {
    return {
      error:
        "Name cannot be empty or contain only spaces.",
    };
  }

  if (!role) {
    return {
      error:
        "Role cannot be empty or contain only spaces.",
    };
  }

  if (!bio) {
    return {
      error:
        "Bio cannot be empty or contain only spaces.",
    };
  }

  if (name.length < 2) {
    return {
      error: "Name must contain at least 2 characters.",
    };
  }

  if (name.length > 100) {
    return {
      error: "Name cannot exceed 100 characters.",
    };
  }

  if (role.length > 100) {
    return {
      error: "Role cannot exceed 100 characters.",
    };
  }

  if (bio.length > 1000) {
    return {
      error: "Bio cannot exceed 1000 characters.",
    };
  }

  if (image.length > 500) {
    return {
      error: "Image URL cannot exceed 500 characters.",
    };
  }

  return {
    data: {
      name,
      role,
      bio,
      image,
    },
  };
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      {
        error: "Forbidden.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid developer ID.",
        },
        {
          status: 400,
        }
      );
    }

    let body: DeveloperInput;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON body.",
        },
        {
          status: 400,
        }
      );
    }

    const validation = validateDeveloperInput(body);

    if (validation.error || !validation.data) {
      return NextResponse.json(
        {
          error:
            validation.error ||
            "Invalid developer data.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const developer =
      await Developer.findByIdAndUpdate(
        id,
        validation.data,
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!developer) {
      return NextResponse.json(
        {
          error: "Developer not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(developer, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "PUT /api/developers/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update developer.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      {
        error: "Forbidden.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid developer ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const developer =
      await Developer.findByIdAndDelete(id);

    if (!developer) {
      return NextResponse.json(
        {
          error: "Developer not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Developer deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/developers/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete developer.",
      },
      {
        status: 500,
      }
    );
  }
}