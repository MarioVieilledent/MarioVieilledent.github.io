// Shared "you are here" marker used by both map renderers (OpenLayers
// mounts this into an ol/Overlay element, MapLibre uses it directly as
// Marker children) so the two renderers stay visually in sync.
const UserLocationDot = () => {
  return (
    <div className="relative flex h-4 w-4 items-center justify-center">
      <span className="absolute inline-flex h-8 w-8 animate-[location-pulse_2s_ease-out_infinite] rounded-full bg-blue-500" />
      <span className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-md" />
    </div>
  );
};

export default UserLocationDot;
