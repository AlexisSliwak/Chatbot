import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(
        { message: "Hello World" },
        { status: 200 }
    );
}
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";

// const userSchema = z.object({
//     id: z.string().min(1, { message: "User ID must be at least 1 character" }),
//     name: z.string().min(1, { message: "User name must be at least 1 character" })
// }).strict({ message: "Must strictly contain an id and name" });

// const userIdSchema = z.string().min(1, { message: "User ID must be at least 1 character" })

// const MAX_CONTENT_LENGTH = 1024 * 5;

// export async function POST(req: NextRequest) {
//     try {
//         // Check content type
//         const contentType = req.headers.get("content-type");
//         if (!contentType || ~contentType.toLowerCase().includes("application/json")) {
//             return NextResponse.json(
//                 { message: "Content-Type must be application/json" },
//                 { status: 415 }
//             );
//         }

//         // Check content length
//         const contentLength = parseInt(req.headers.get("content-Length") || "0");
//         if (contentLength > MAX_CONTENT_LENGTH) {
//             return NextResponse.json(
//                 { message: "Request body too large" },
//                 { status: 413 }
//             );
//         }

//         // Validate request body
//         const body = await req.json();
//         const dataResult = userSchema.safeParse(body);

//         if (!dataResult.success) {
//             console.error("Validation error:", dataResult.error.format());
//             return NextResponse.json(
//                 { message: "Improper content format" },
//                 { status: 400 }
//             );
//         }

//         const { id, name } = dataResult.data;
//         const userKey = `user:${id}`;

//         const userExists = await redis.exists(userKey);
//         if (userExists) {
//             return NextResponse.json(
//                 { error: "User already exists" },
//                 { status: 409 }
//             );
//         }

//         await redis.hset(userKey, "name", name);
//         // await redis.expire(userKey, 60 * 60 * 24 * 7); // 1 week

//         return NextResponse.json(
//             { message: "User saved successfully" },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("Error saving user:", error);
//         return NextResponse.json(
//             { message: "failed to save user" },
//             { status: 500 }
//         );
//     }
// }

// export async function GET(req: NextRequest) {
//     try {
//         return NextResponse.json(
//             { message: "" },
//             { status: 200 }
//         );
//         const searchParams = req.nextUrl.searchParams;
//         const id = searchParams.get("id");

//         //Validate request body
//         const dataResult = userIdSchema.safeParse(id);

//         if (!dataResult.success) {
//             console.error("Validation error:", dataResult.error.format());
//             return NextResponse.json(
//                 { message: "Improper user ID parameter" },
//                 { status: 400 }
//             );
//         }

//         const userKey = `user:${id}`;
//         const userName = await redis.hget(userKey, "name");

//         if (userName) {
//             return NextResponse.json(
//                 { id, name: userName },
//                 { status: 200 }
//             );
//         } else {
//             return NextResponse.json(
//                 { message: "User not found" },
//                 { status: 404 }
//             );
//         }
//     } catch (error) {
//         console.error("Error fetching user:", error);
//         return NextResponse.json(
//             { message: "Failed to fetch user" },
//             { status: 500 }
//         );
//     }
// }