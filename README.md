## What is it?

This app is built with React and NextJS. It uses Github Discussions to store posts.
Check it out on [ulvidamirli.com](http://ulvidamirli.com).

## Getting Started

1. Create and copy a Github API access token through your Github account settings.
2. Create an `.env` file in root directory using `.env.example` as example. Add your access token and other details to `.env` file.
3. In your Github repo settings, under the 'Features' section, enable 'Discussions'.
4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Don't forget to add posts to Github Discussion to see it in app.
