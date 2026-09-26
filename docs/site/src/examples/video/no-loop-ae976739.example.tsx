import { Video } from "@/components/ui/video";

export function VideoNoLoopAE976739Example() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
    </div>
  );
}
