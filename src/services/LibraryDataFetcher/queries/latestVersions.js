export default libraries => `
{
  libraries(names:"${libraries}", token:"$token") {
    ...LIBRARY_VERSION
  }
}

${LIBRARY_FRAGMENT}
`;

export const LIBRARY_FRAGMENT = `
fragment LIBRARY_VERSION on Library { 
      name
      current_version
      description
      version_data {
        date
        version
        age_days
        age_text
      }
    }
`;