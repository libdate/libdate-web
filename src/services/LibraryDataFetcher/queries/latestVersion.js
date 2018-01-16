export default libraryName => `
    library(name: "${libraryName}", source: npm) {
      name
      current_version
      source
      description
      version_data {
        date
        version
        age_days
        age_text
      }
    }
`;