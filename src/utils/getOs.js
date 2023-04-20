export const getOs = () => {
  const os = ["Windows", "Linux", "Mac"] // add your OS values
  return os.find(v => navigator.appVersion.indexOf(v) >= 0)
}
