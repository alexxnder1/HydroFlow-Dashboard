import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

export const graphTheme = {
  axis: {
      ticks: {
          text: {
              fontSize: 15, // Aici mărești scrisul pentru cifrele/valorile de pe axe
              fill: "#333"  // Opțional: culoarea textului
          }
      },
      legend: {
          text: {
              fontSize: 20, // Aici mărești scrisul pentru titlul axei (ex: "Timp", "Venit")
              fontWeight: "bold"
          }
      }
}}

const config = defineConfig({
    theme: {
      tokens: {
        colors: {
          brand: {
            50: { value: "#ffffff" },  // Fundal carduri/hover
            500: { value: "#ffffff" }, // Culoare principală (Butoane, iconițe)
            800: { value: "#ffffff" }, // Text important / Dark mode accent
          },
          status: {
            wet: { value: "#ffffff" },
            optimal: { value: "#38a169" },
            dry: { value: "#dd6b20" },
            critical: { value: "#e53e3e" },
          },
        },
      },
    },
  })
export const system = createSystem(defaultConfig, config)
