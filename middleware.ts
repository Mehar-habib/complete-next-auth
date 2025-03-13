import { auth } from "@/auth";
// export { auth as middleware } from "@/auth";

export default auth((req) => {
  console.log("Route ", req.nextUrl.pathname);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)r"],
};
