import { GitHubAvatar, GitLabAvatar, BitbucketAvatar } from "@hustradio/unitary-ui";

export function AvatarGitB949C922Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <GitHubAvatar size={32} username="rauchg" />
      <GitLabAvatar size={32} username="severinlandolt" />
      <BitbucketAvatar size={32} username="evilrabbit" />
    </div>
  );
}
