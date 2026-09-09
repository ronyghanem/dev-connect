DevConnect

A modern developer community platform built with Next.js 16, MongoDB Atlas, Mongoose, NextAuth, and Tailwind CSS.

DevConnect allows developers to create profiles, discover other developers, share technical posts, and manage their own content. The platform also includes an administrator management interface and a complete MongoDB-backed CRUD system for developer records.

The project combines a modern **space/neon/glassmorphism interface** with a real full-stack architecture using Next.js Route Handlers, Server Actions, Mongoose, and MongoDB Atlas.



Features

Developer Community

* Browse developer profiles
* View individual developer profiles
* GitHub-based developer authentication
* Automatically save authenticated GitHub users to MongoDB
* Display developer profile photos
* Display developer names, bios, skills, GitHub usernames, and profile information
* Responsive developer directory



Community Posts

* Browse community posts
* View individual posts
* Create posts
* Edit posts
* Delete posts
* Posts are stored in MongoDB
* Posts are linked to their author
* Author information and profile images are displayed
* Creation dates are displayed
* Responsive post layout



Authentication & Authorization

DevConnect uses NextAuth with GitHub authentication.

Authenticated users can:

* Sign in with GitHub
* Create community posts
* Edit their own posts
* Delete their own posts
* Manage their own profile

Administrators can additionally:

* Edit any community post
* Delete any community post
* Access the developer management dashboard
* Create developer records
* Update developer records
* Delete developer records

Authorization is enforced on both the frontend and backend.



Post Permissions

Post permissions follow an owner/admin model:

| Action                     | Admin | Post Owner | Other Developer |
| -------------------------- | :---: | :--------: | :-------------: |
| View post                  |   ✅   |      ✅     |        ✅        |
| Create post                |   ✅   |      ✅     |        ✅        |
| Edit own post              |   ✅   |      ✅     |        ❌        |
| Delete own post            |   ✅   |      ✅     |        ❌        |
| Edit another user's post   |   ✅   |      ❌     |        ❌        |
| Delete another user's post |   ✅   |      ❌     |        ❌        |

Permissions are checked at multiple levels:

* Post listing UI
* Post detail page
* Edit page
* Server Actions
* API Route Handlers

This prevents users from bypassing the frontend and directly modifying unauthorized posts.



MongoDB & Mongoose

The application uses MongoDB Atlas as its persistent database and Mongoose as the ODM.

The project includes a reusable MongoDB connection helper that reads the connection string from an environment variable.


Next.js
   │
   ├── Server Components
   ├── Server Actions
   └── API Route Handlers
          │
          ▼
       Mongoose
          │
          ▼
     MongoDB Atlas


Database Models

User

The `User` model stores authenticated developer information.

Main fields include:

* `name`
* `email`
* `image`
* `bio`
* `skills`
* `githubUsername`
* `githubId`
* `createdAt`
* `updatedAt`



Post

The `Post` model stores community posts.

Main fields include:

* `title`
* `content`
* `author`
* `authorName`
* `createdAt`
* `updatedAt`

The `author` field references the MongoDB `User` document.



Developer

The assignment-specific `Developer` model provides a dedicated MongoDB-backed CRUD resource.

Main fields include:

* `name`
* `role`
* `bio`
* `image`
* `createdAt`
* `updatedAt`

The schema uses validation, trimming, timestamps, and Mongoose model caching to work correctly with Next.js development reloads.



Developer CRUD

DevConnect includes a complete CRUD implementation for developer records.

PI Endpoints

Get Developers

GET /api/developers

Returns all developer records from MongoDB.



Create Developer

POST /api/developers

Creates a new developer record.

Required fields:


{
  "name": "John Doe",
  "role": "Full Stack Developer",
  "bio": "Developer interested in modern web technologies."
}


Optional field:

{
  "image": "https://example.com/profile.jpg"
}



Update Developer

PUT /api/developers/[id]

Updates an existing developer.



Delete Developer


DELETE /api/developers/[id]

Deletes an existing developer.


API Status Codes

The API handles appropriate responses including:

* `200` — Successful request
* `201` — Resource created
* `400` — Invalid request/data
* `401` — Authentication required
* `403` — Forbidden
* `404` — Resource not found
* `500` — Server/database error

Responses are returned as clean JSON objects.



Developer Management Dashboard

Administrators can access:


/developers-crud


The management interface provides:

* Developer listing
* Add developer form
* Edit developer functionality
* Delete developer functionality
* Image URL support
* Loading states
* Error states
* Empty states
* Delete confirmation
* Responsive UI
* MongoDB-backed persistence

The page demonstrates the complete end-to-end CRUD flow:

Form
  ↓
Next.js API Route
  ↓
Mongoose
  ↓
MongoDB Atlas
  ↓
Updated UI


Developer Profiles

The main developer directory is available at:


/developers


Developers can be viewed through their individual profile pages:

/developers/[id]


The community developer directory is based on authenticated `User` records, while the assignment CRUD system uses the dedicated `Developer` model.

This keeps the existing GitHub developer community functionality separate from the assignment's dedicated CRUD implementation.


Posts Architecture

Posts are available at:


/posts


Individual posts:


/posts/[id]


Create a post:


/posts/new


Edit a post:


/posts/[id]/edit


Posts use both:

* Next.js Server Components
* Next.js Server Actions
* API Route Handlers
* MongoDB/Mongoose

This provides both server-side and API-based operations.


Admin System

Administrator access is controlled through an environment variable rather than hard-coding an email address in the source code.


ADMIN_EMAIL=your-admin-email


The application compares the authenticated user's email with the configured administrator email.

Admin authorization is centralized through:

lib/isAdmin.ts


The admin system is used for:

* Developer management access
* Developer CRUD operations
* Managing any community post

Unauthorized users are redirected or receive a `403 Forbidden` response depending on the operation.


 UI & Design

DevConnect uses a custom futuristic developer-community design.

Visual style

* Space-inspired background
* Neon cyan and violet accents
* Glassmorphism cards
* Frosted glass effects
* Backdrop blur
* Gradient effects
* Neon borders
* Soft glowing shadows
* Animated reveal effects
* Responsive layouts
* Dark futuristic aesthetic

The design was built to make the application feel like a modern developer platform rather than a basic CRUD demonstration.

Responsive Design

The interface is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

The navigation includes responsive desktop and mobile behavior.


Navigation

The application includes:

* Home
* Developers
* Manage Developers *(admin only)*
* Posts
* My Profile
* Authentication controls

The Manage Developers navigation item is only displayed to administrators.


Authentication

Authentication is implemented with NextAuth and GitHub.

When a developer signs in with GitHub:

1. NextAuth authenticates the user.
2. GitHub account information is received.
3. The application connects to MongoDB.
4. The user's profile is created or updated.
5. The user becomes available in the developer community.

GitHub information can include:

* Name
* Email
* Profile image
* GitHub username
* GitHub account ID


Project Structure


dev-connect/
│
├── app/
│   ├── api/
│   │   ├── developers/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   └── posts/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   │
│   ├── (main)/
│   │   ├── developers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── developers-crud/
│   │   │   ├── page.tsx
│   │   │   └── DevelopersClient.tsx
│   │   │
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   ├── PostActions.tsx
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │
│   │   └── ...
│   │
│   └── ...
│
├── components/
│   ├── Navbar.tsx
│   ├── NavLinks.tsx
│   └── ...
│
├── lib/
│   ├── mongodb.ts
│   ├── isAdmin.ts
│   ├── saveUser.ts
│   └── actions/
│       └── posts.ts
│
├── models/
│   ├── User.ts
│   ├── Post.ts
│   └── Developer.ts
│
├── public/
│
├── auth.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md


Technologies

Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS

Backend

* Next.js Route Handlers
* Next.js Server Actions
* Node.js
* Mongoose

Database

* MongoDB Atlas

Authentication

* NextAuth
* GitHub OAuth

Development

* ESLint
* npm
* Git
* GitHub



Installation

1. Clone the repository


git clone https://github.com/ronyghanem/dev-connect.git


Enter the project directory:


cd dev-connect


2. Install dependencies


npm install


3. Configure environment variables

Create a file named:


.env.local


Add the required environment variables:


MONGODB_URI=your_mongodb_atlas_connection_string

ADMIN_EMAIL=your_admin_email

GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret

AUTH_SECRET=your_auth_secret



MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure the network access settings.
5. Copy the MongoDB connection string.
6. Add it to `.env.local` as:


MONGODB_URI=your_connection_string


The application uses Mongoose to connect to the Atlas cluster.

The required collections are created automatically when documents are stored.



Running the Project

Start the development server:

npm run dev


Open:

http://localhost:3000


The application will be available locally.



Testing

The project can be tested through the following flows.

Developer CRUD

1. Sign in as administrator.
2. Open `/developers-crud`.
3. Create a developer.
4. Refresh the page.
5. Confirm the developer remains.
6. Edit the developer.
7. Refresh again.
8. Confirm the changes remain.
9. Delete the developer.
10. Confirm the developer is removed.

This verifies that the application is using persistent MongoDB storage rather than temporary in-memory state.

Post Permissions

Developer A

* Create a post.
* Edit their own post.
* Delete their own post.
* Attempt to edit another developer's post.

The last operation should be rejected.

Developer B

The same ownership restrictions apply.

Administrator

The administrator should be able to:

* Edit any post.
* Delete any post.
* Access Developer Management.

Logged-out user

A logged-out visitor can browse public content but cannot create, edit, or delete protected resources.



Security Considerations

The application avoids relying solely on frontend visibility for authorization.

For example, hiding an Edit button does not provide security by itself.

Authorization is also checked server-side through:

* Next.js Server Actions
* API Route Handlers
* Session validation
* MongoDB user lookup
* Post ownership checks
* Administrator checks

Therefore, manually requesting a protected endpoint does not bypass the permission system.



Build

Before deployment or submission, run:


npm run build


A successful production build confirms that the application compiles correctly for production.


Deployment

The application can be deployed to a Next.js-compatible hosting platform such as Vercel.

When deploying, configure the same environment variables in the hosting provider:


MONGODB_URI=...
ADMIN_EMAIL=...
GITHUB_ID=...
GITHUB_SECRET=...
AUTH_SECRET=...


Do not upload `.env.local` or expose credentials in the repository.



Assignment Requirements

This project fulfills the MongoDB CRUD assignment requirements:

MongoDB Atlas

The application was upgraded from local/in-memory data to persistent MongoDB Atlas storage.

Mongoose

Mongoose is used to connect the Next.js application to MongoDB and define database schemas.

Developer Model

A dedicated `Developer` model was created with fields including:


name
role
bio
image
createdAt
updatedAt



API CRUD

The following endpoints were implemented:


GET     /api/developers
POST    /api/developers
PUT     /api/developers/[id]
DELETE  /api/developers/[id]


Frontend CRUD

The Developer Management page provides:

* Database records
* Create form
* Edit functionality
* Delete functionality
* Loading states
* Error states
* Empty states


End-to-End Flow

The final architecture demonstrates:


Next.js Frontend
       ↓
Route Handlers
       ↓
Mongoose
       ↓
MongoDB Atlas
       ↓
Persistent Database




Project Goals

DevConnect was built to demonstrate practical full-stack development skills, including:

* Modern React development
* Next.js App Router
* Server Components
* Client Components
* Server Actions
* REST-style API Route Handlers
* Authentication
* Authorization
* MongoDB database design
* Mongoose schemas
* CRUD operations
* Database relationships
* Responsive UI development
* Error handling
* Loading states
* Git/GitHub workflow
* Production build validation


Author

Rony Ghanem

Management Information Systems student and developer focused on web development, data, AI integration, and modern full-stack applications.

Links

* Portfolio: https://ronygh.netlify.app
* GitHub: https://github.com/ronyghanem
* LinkedIn: https://www.linkedin.com/in/rony-ghanem

License

This project was created for educational, portfolio, and development purposes.
