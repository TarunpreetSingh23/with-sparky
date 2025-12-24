export default function TopBar({ username }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <span className="text-gray-600">👤 {username}</span>
    </div>
  );
}
