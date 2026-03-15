// Tradução do Leaflet Draw para português
L.drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: "Cancelar desenho",
        text: "Cancelar",
      },
      finish: {
        title: "Finalizar desenho",
        text: "Finalizar",
      },
      undo: {
        title: "Remover último ponto",
        text: "Desfazer",
      },
      buttons: {
        polyline: "Desenhar linha",
        polygon: "Desenhar polígono",
        rectangle: "Desenhar retângulo",
        circle: "Desenhar círculo",
        marker: "Adicionar ponto",
        circlemarker: "Adicionar ponto circular",
      },
    },
    handlers: {
      circle: {
        tooltip: {
          start: "Clique e arraste para desenhar um círculo.",
        },
        radius: "Raio",
      },
      circlemarker: {
        tooltip: {
          start: "Clique no mapa para adicionar um ponto circular.",
        },
      },
      marker: {
        tooltip: {
          start: "Clique no mapa para adicionar um ponto.",
        },
      },
      polygon: {
        tooltip: {
          start: "Clique para começar a desenhar o polígono.",
          cont: "Clique para continuar desenhando.",
          end: "Clique no primeiro ponto para fechar o polígono.",
        },
      },
      polyline: {
        error: "<strong>Erro:</strong> as linhas não podem se cruzar.",
        tooltip: {
          start: "Clique para começar a desenhar a linha.",
          cont: "Clique para continuar desenhando.",
          end: "Clique no último ponto para finalizar a linha.",
        },
      },
      rectangle: {
        tooltip: {
          start: "Clique e arraste para desenhar o retângulo.",
        },
      },
      simpleshape: {
        tooltip: {
          end: "Solte o mouse para finalizar o desenho.",
        },
      },
    },
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: "Salvar alterações",
          text: "Salvar",
        },
        cancel: {
          title: "Cancelar edição",
          text: "Cancelar",
        },
        clearAll: {
          title: "Remover todos os elementos",
          text: "Limpar",
        },
      },
      buttons: {
        edit: "Editar elementos",
        editDisabled: "Nenhum elemento para editar",
        remove: "Remover elementos",
        removeDisabled: "Nenhum elemento para remover",
      },
    },
    handlers: {
      edit: {
        tooltip: {
          text: "Arraste os pontos para editar o elemento.",
          subtext: "Clique em cancelar para desfazer as alterações.",
        },
      },
      remove: {
        tooltip: {
          text: "Clique em um elemento para removê-lo.",
        },
      },
    },
  },
};

const map = L.map("map").setView([-20.4697, -54.6201], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const featureList = document.getElementById("featureList");
const fileInput = document.getElementById("fileInput");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

const STORAGE_KEY = "geoData";

const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
  },
  draw: {
    polygon: {
      allowIntersection: false,
      showArea: true,
    },
    polyline: true,
    rectangle: false,
    circle: false,
    circlemarker: false,
    marker: true,
  },
});

map.addControl(drawControl);

function getGeometryTypeLabel(layer) {
  if (layer instanceof L.Marker) return "Ponto";
  if (layer instanceof L.Polygon) return "Polígono";
  if (layer instanceof L.Polyline) return "Linha";
  return "Elemento";
}

function getLayerName(layer, fallbackIndex = 1) {
  return (
    layer?.feature?.properties?.nome ||
    `${getGeometryTypeLabel(layer)} ${fallbackIndex}`
  );
}

function getLayerDescription(layer) {
  return layer?.feature?.properties?.descricao || "Sem descrição";
}

function getCoordinatesText(layer) {
  if (layer instanceof L.Marker) {
    const latlng = layer.getLatLng();
    return `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
  }

  if (layer.getBounds) {
    const bounds = layer.getBounds();
    const center = bounds.getCenter();
    return `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`;
  }

  return "Coordenadas indisponíveis";
}

function createPopupContent(layer) {
  const nome = getLayerName(layer);
  const descricao = getLayerDescription(layer);
  const tipo = getGeometryTypeLabel(layer);
  const coordenadas = getCoordinatesText(layer);

  return `
    <div style="min-width: 200px; font-family: Inter, Arial, sans-serif;">
      <strong style="font-size: 14px;">${nome}</strong>
      <div style="margin-top: 6px; font-size: 13px; color: #475569;">
        <div><strong>Tipo:</strong> ${tipo}</div>
        <div><strong>Descrição:</strong> ${descricao}</div>
        <div><strong>Coordenadas:</strong> ${coordenadas}</div>
      </div>
    </div>
  `;
}

function bindLayerEvents(layer) {
  layer.bindPopup(createPopupContent(layer));
}

function saveLocal() {
  const data = drawnItems.toGeoJSON();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function updateSidebar() {
  featureList.innerHTML = "";

  let count = 0;

  drawnItems.eachLayer(function (layer) {
    if (!layer.feature) return;

    count++;

    const li = document.createElement("li");
    const nome = getLayerName(layer, count);
    const tipo = getGeometryTypeLabel(layer);

    li.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:4px;">
        <span style="font-weight:600;">${nome}</span>
        <span style="font-size:12px; color:#64748b;">${tipo}</span>
      </div>
    `;

    li.addEventListener("click", function () {
      if (layer.getBounds && !(layer instanceof L.Marker)) {
        map.fitBounds(layer.getBounds(), { padding: [40, 40] });
      } else if (layer.getLatLng) {
        map.setView(layer.getLatLng(), 16);
      }

      layer.openPopup();
    });

    featureList.appendChild(li);
  });

  if (count === 0) {
    featureList.innerHTML =
      '<div class="empty-state">Nenhum elemento adicionado ainda.</div>';
  }
}

function ensureFeatureObject(layer, defaultName = null, defaultDescription = null) {
  if (!layer.feature) {
    layer.feature = {
      type: "Feature",
      properties: {},
    };
  }

  if (!layer.feature.properties) {
    layer.feature.properties = {};
  }

  if (!layer.feature.properties.nome) {
    layer.feature.properties.nome =
      defaultName || `${getGeometryTypeLabel(layer)} ${drawnItems.getLayers().length + 1}`;
  }

  if (!layer.feature.properties.descricao) {
    layer.feature.properties.descricao = defaultDescription || "Sem descrição";
  }
}

function loadGeoJSONToMap(geojson) {
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      layer.feature = feature || {
        type: "Feature",
        properties: {},
      };

      if (!layer.feature.properties) {
        layer.feature.properties = {};
      }

      if (!layer.feature.properties.nome) {
        layer.feature.properties.nome = "Elemento importado";
      }

      if (!layer.feature.properties.descricao) {
        layer.feature.properties.descricao = "Sem descrição";
      }

      bindLayerEvents(layer);
      drawnItems.addLayer(layer);
    },
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng);
    },
  });
}

function loadLocal() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    updateSidebar();
    return;
  }

  try {
    const geojson = JSON.parse(data);
    loadGeoJSONToMap(geojson);
    updateSidebar();
  } catch (error) {
    console.error("Erro ao carregar dados locais:", error);
    localStorage.removeItem(STORAGE_KEY);
    updateSidebar();
  }
}

function exportGeoJSON() {
  const data = drawnItems.toGeoJSON();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/geo+json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "dados_gerados.geojson";
  a.click();

  URL.revokeObjectURL(url);
}

function clearMap() {
  const confirmClear = window.confirm(
    "Tem certeza que deseja limpar todos os elementos criados ou importados?"
  );

  if (!confirmClear) return;

  drawnItems.clearLayers();
  localStorage.removeItem(STORAGE_KEY);
  updateSidebar();
}

function promptForLayerData(layer) {
  const defaultName = `${getGeometryTypeLabel(layer)} ${drawnItems.getLayers().length + 1}`;
  const nome = window.prompt("Nome do elemento:", defaultName);
  const descricao = window.prompt("Descrição do elemento:", "Sem descrição");

  ensureFeatureObject(layer, nome || defaultName, descricao || "Sem descrição");
  layer.feature.properties.nome = nome || defaultName;
  layer.feature.properties.descricao = descricao || "Sem descrição";
}

function addSanesulUnits() {
  const sanesulUnits = [
    {
      nome: "Sanesul - Administração Central",
      descricao: "Unidade da Sanesul em Campo Grande/MS.",
      endereco: "Rua Doutor Zerbini, 421 - Chácara Cachoeira, Campo Grande/MS",
      coordenadas: [-20.456786, -54.594722],
    },
    {
      nome: "Sanesul - Unidade de Atendimento",
      descricao: "Ponto de referência da Sanesul em Campo Grande/MS.",
      endereco: "Região central de Campo Grande/MS",
      coordenadas: [-20.469710, -54.620120],
    },
  ];

  sanesulUnits.forEach((unidade) => {
    const marker = L.marker(unidade.coordenadas).addTo(map);

    marker.bindPopup(`
      <div style="min-width: 220px; font-family: Inter, Arial, sans-serif;">
        <strong style="font-size: 14px;">${unidade.nome}</strong>
        <div style="margin-top: 6px; font-size: 13px; color: #475569;">
          <div><strong>Endereço:</strong> ${unidade.endereco}</div>
          <div><strong>Latitude:</strong> ${unidade.coordenadas[0]}</div>
          <div><strong>Longitude:</strong> ${unidade.coordenadas[1]}</div>
        </div>
      </div>
    `);
  });
}

map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;

  promptForLayerData(layer);
  bindLayerEvents(layer);

  drawnItems.addLayer(layer);
  updateSidebar();
  saveLocal();
});

map.on("draw:edited", function () {
  drawnItems.eachLayer(function (layer) {
    if (!layer.feature) return;
    bindLayerEvents(layer);
  });

  saveLocal();
  updateSidebar();
});

map.on("draw:deleted", function () {
  saveLocal();
  updateSidebar();
});

fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const geojson = JSON.parse(event.target.result);
      loadGeoJSONToMap(geojson);
      updateSidebar();
      saveLocal();
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
      alert("Arquivo inválido. Selecione um JSON ou GeoJSON válido.");
    }
  };

  reader.readAsText(file);
  fileInput.value = "";
});

exportBtn.addEventListener("click", exportGeoJSON);
clearBtn.addEventListener("click", clearMap);

addSanesulUnits();
loadLocal();
updateSidebar();