import Map from "@/components/GoogleMap";

export default function TaskPage() {
  const location = {
    lat: 28.6139,
    lng: 77.2090,
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Task Location</h1>

      <Map center={location} />
    </div>
  );
}
