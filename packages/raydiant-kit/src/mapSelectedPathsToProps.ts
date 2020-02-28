export type Path = Array<string | number>;

export interface SelectedPropertyPath {
  propertyPath: Path;
  selectedPath: Path;
}

export default (selectedPaths: SelectedPropertyPath[]) => {
  return selectedPaths.map(({ propertyPath, selectedPath }) => {
    // Merge paths to get the full selected path.
    const fullPath = [...propertyPath, ...selectedPath];
    // In RaydiantKit we only want to know about selected paths changes
    // from applicationVariables, and applicationVariables is called values.
    // remove 'applicationVariables' from the start of the path to avoid confusion.
    if (fullPath[0] === 'applicationVariables') fullPath.shift();
    return fullPath;
  });
};
