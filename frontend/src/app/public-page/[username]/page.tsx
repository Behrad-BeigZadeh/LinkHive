import PublicProfile from "@/components/PublicProfile";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div className="min-h-screen flex items-center  justify-center px-4 py-10  text-white">
      <PublicProfile username={username} />
    </div>
  );
}
