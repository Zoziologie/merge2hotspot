<script setup>
import { MapboxMap, MapboxMarker, MapboxCluster, MapboxPopup } from "@studiometa/vue-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
</script>

<template>
  <div class="container-fluid h-100 d-flex flex-column p-0">
    <div class="row flex-grow-1 gx-0">
      <div class="col-md-4 vh-100 d-flex flex-column">
        <div class="row mx-2 my-1">
          <div class="col"><h3>Merge2Hotspot</h3></div>
          <div class="col text-end align-middle">
            <button
              type="button"
              class="btn btn-primary btn-sm align-middle"
              data-bs-toggle="modal"
              data-bs-target="#modalInformation"
            >
              <i class="bi bi-info-circle"></i>
            </button>
          </div>
        </div>

        <!-- Nav tabs -->
        <ul class="nav nav-tabs nav-fill px-1" id="mainTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="import-tab"
              data-bs-toggle="tab"
              data-bs-target="#import"
              type="button"
              role="tab"
              aria-controls="import"
              aria-selected="false"
            >
              1. Import
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              :class="{ disabled: step < 2 }"
              :aria-disabled="step < 2"
              id="hotspot-tab"
              data-bs-toggle="tab"
              data-bs-target="#hotspot"
              type="button"
              role="tab"
              aria-controls="hotspot"
              aria-selected="false"
            >
              2. Hotspot
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              :class="{
                disabled: step < 3,
              }"
              :aria-disabled="step < 3"
              id="merge-tab"
              data-bs-toggle="tab"
              data-bs-target="#merge"
              type="button"
              role="tab"
              aria-controls="merge"
              aria-selected="false"
            >
              3. Merge
            </button>
          </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content flex-grow-1 overflow-auto">
          <div
            class="tab-pane px-3 py-3 active"
            id="import"
            role="tabpanel"
            aria-labelledby="import-tab"
          >
            <p>
              Import your eBird data (<code>MyEBirdData.csv</code>), which you can
              <a href="https://ebird.org/downloadMyData" target="_blank">
                request from the eBird website </a
              >:
            </p>
            <label class="w-100 mb-3">
              <input
                type="file"
                class="form-control"
                accept=".csv"
                @change="processMyeBirdDataFile"
              />
              <span class="custom-file-control"></span>
            </label>
            <div v-if="loadingMyeBirdDataStatus == 0">
              <div class="alert alert-warning d-flex align-items-center" role="alert">
                <div
                  class="spinner-border me-2 spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></div>
                <strong class="me-1">Loading data.</strong> This might take up to a minute...
              </div>
            </div>
            <div v-else-if="loadingMyeBirdDataStatus == 1">
              <div class="alert alert-success" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Data loaded successfully! </strong>
                {{ formatNb(myLocation.reduce((b, e) => b + e.subId.length, 0)) }}
                checklists over {{ formatNb(myLocation.length) }} locations.
                <br />
                Go to the next tab to load hotspot information
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary my-1"
                  @click="navTabActivate('hotspot')"
                >
                  2. Hotspot
                </button>
              </div>
            </div>
            <div v-else-if="loadingMyeBirdDataStatus == -1">
              <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>There is an error! </strong>
                Please check that the file uploaded is the raw
                <code>MyEBirdData.csv</code> downloaded from
                <a href="https://ebird.org/downloadMyData" target="_blank">eBird.org</a>. If the
                error persists, please contact me at
                <a href="mailto:rafnuss@gmail.com">rafnuss@gmail.com</a> with your file.
                <br />
              </div>
            </div>
          </div>
          <div
            class="tab-pane px-3 py-3"
            id="hotspot"
            role="tabpanel"
            aria-labelledby="hotspot-tab"
          >
            <p>Next, download the eBird hotspots for the regions you want to review.</p>
            <div class="alert alert-success" role="alert" v-if="step == 3">
              <i class="bi bi-check-circle-fill me-2"></i>
              <strong>Hotspots loaded successfully! </strong>
              You can add more regions or move to the final step
              <button
                type="button"
                class="btn btn-sm btn-outline-primary my-1"
                @click="navTabActivate('merge')"
              >
                <small>3. Merge</small>
              </button>
            </div>
            <ul class="list-group">
              <li
                v-for="r in region.filter((e) => e.subIdNb > 0)"
                :key="r.code"
                class="list-group-item d-flex justify-content-between align-items-start px-1 py-1"
              >
                <div class="ms-2 me-auto">
                  <span class="fw-bold">
                    {{ r.name }}
                  </span>
                  <span v-if="r.status != 'downloaded'" class="badge bg-secondary pill ms-2"
                    >{{ formatNb(r.locIdNb) }}
                    <i class="bi bi-pin"></i>
                  </span>
                  <span v-if="r.status == 'downloaded'" class="badge bg-danger pill ms-2"
                    >{{ formatNb(r.locIdNb - r.locPerNb) }}
                    <i class="bi bi-pin"></i>
                  </span>
                  <span v-if="r.status == 'downloaded'" class="badge bg-primary pill ms-2"
                    >{{ formatNb(r.locPerNb) }}
                    <i class="bi bi-pin"></i>
                  </span>
                  <a :href="'https://ebird.org/mychecklists/' + r.code" target="_blank">
                    <span class="badge bg-primary pill ms-2"
                      >{{ formatNb(r.subIdNb) }}
                      <i class="bi bi-card-checklist"></i>
                    </span>
                  </a>
                </div>
                <button
                  class="btn btn-sm"
                  :class="regionActionClass(r.status)"
                  :disabled="r.status !== null"
                  @click="downloadRegion(r)"
                >
                  <i v-if="r.status === null" class="bi bi-download"></i>
                  <div
                    v-else-if="r.status === 'loading'"
                    class="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <i v-else-if="r.status === 'downloaded'" class="bi bi-check-circle"></i>
                  <i v-else class="bi bi-exclamation-circle"></i>
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-pane px-3 py-3" id="merge" role="tabpanel" aria-labelledby="merge-tab">
            <p>
              Browse the map or use the list below to find the locations you wish to merge or edit.
              You can also rename a location or suggest it as an eBird hotspot.
            </p>
            <div class="btn-group mb-2" role="group">
              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio1"
                autocomplete="off"
                v-model="filterList"
                value="time"
                checked
              />
              <label class="btn btn-sm btn-outline-primary" for="btnradio1"
                >Latest checklists</label
              >

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio2"
                autocomplete="off"
                v-model="filterList"
                value="distance"
              />
              <label class="btn btn-sm btn-outline-primary" for="btnradio2"
                >Distance to hotspot</label
              >

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio3"
                autocomplete="off"
                v-model="filterList"
                value="number"
              />
              <label class="btn btn-sm btn-outline-primary" for="btnradio3"
                >Number of checklists</label
              >
            </div>
            <div class="list-group">
              <a
                href="#"
                v-for="m in myPersonalLocationSorted"
                :key="m.locId"
                class="list-group-item d-flex justify-content-between align-items-start px-1 py-1 list-group-item-action"
                @click.prevent="map?.flyTo({ center: [m.lng, m.lat], zoom: 14 })"
              >
                <div class="ms-2 me-auto">
                  {{ m.locname }}
                  <small
                    ><span class="fw-bold"> {{ m.region }} </span></small
                  >
                  <a :href="'https://ebird.org/mychecklists/' + m.locId" target="_blank">
                    <span class="badge bg-primary pill ms-2"
                      >{{ formatNb(m.subIdNb) }}
                      <i class="bi bi-card-checklist"></i>
                    </span>
                  </a>
                  <span class="badge bg-secondary pill ms-2">
                    <i class="bi bi-pin-map-fill"></i>
                    {{ formatDistance(m.closestHotspot.dist) }}
                  </span>
                  <a
                    :href="'https://ebird.org/mylocations/edit/' + m.locId"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary align-self-center ms-2 py-0"
                  >
                    Edit location
                  </a>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="left-panel-footer px-2 py-2 mt-auto">
          <a
            type="button"
            class="btn btn-outline-secondary btn-sm align-middle"
            href="https://github.com/Zoziologie/merge2hotspot"
            target="_blank"
            rel="noreferrer"
          >
            <i class="bi bi-github me-1"></i>
            GitHub
          </a>
          <a
            type="button"
            class="btn btn-outline-danger btn-sm align-middle"
            href="https://github.com/sponsors/Zoziologie"
            target="_blank"
            rel="noreferrer"
          >
            <i class="bi bi-heart-fill me-1"></i>
            Sponsor
          </a>
        </div>
      </div>
      <div class="col flex-grow-1">
        <MapboxMap
          :map-style="mapStyle"
          class="h-100"
          :center="[0, 20]"
          :zoom="1"
          :access-token="mapboxAccessToken"
          @mb-created="handleMapCreated"
        >
          <MapboxPopup
            v-if="popupIsOpen"
            :key="popupPosition.join('-')"
            :lng-lat="popupPosition"
            anchor="bottom"
            :close-button="false"
            :class-name="
              popupVariant === 'location'
                ? 'm2h-mapbox-popup m2h-mapbox-popup--location'
                : 'm2h-mapbox-popup m2h-mapbox-popup--hotspot'
            "
            max-width="19rem"
            @mb-close="() => (popupIsOpen = false)"
          >
            <div
              class="map-popup"
              :class="popupVariant === 'location' ? 'map-popup--location' : 'map-popup--hotspot'"
            >
              <div class="map-popup__header">
                <div class="map-popup__title">
                  <i :class="popupVariant === 'location' ? 'bi bi-geo-alt-fill' : 'bi bi-binoculars-fill'"></i>
                  <a
                    :href="
                      'https://ebird.org/hotspot/' + popupLoc.locId
                    "
                    target="_blank"
                  >
                    {{ popupTitle }}
                  </a>
                </div>
                <button
                  type="button"
                  class="btn-close btn-close-sm map-popup__close"
                  aria-label="Close"
                  @click="popupIsOpen = false"
                ></button>
              </div>
              <div class="map-popup__chips">
                <span v-if="popupVariant === 'location'" class="badge rounded-pill text-bg-primary">
                  <i class="bi bi-card-checklist"></i>
                  {{ formatNb(popupLocationChecklistCount) }} checklists
                </span>
                <span v-else class="badge rounded-pill text-bg-secondary">
                  <i class="bi bi-binoculars-fill"></i>
                  {{ formatNb(popupLoc.numSpeciesAllTime ?? 0) }} species
                </span>
              </div>
              <div class="map-popup__footer">
                <a
                  :href="
                    popupVariant === 'location'
                      ? 'https://ebird.org/mylocations/edit/' + popupLoc.locId
                      : 'https://ebird.org/hotspot/' + popupLoc.locId
                  "
                  target="_blank"
                  class="map-popup__link"
                >
                  {{ popupVariant === 'location' ? 'Edit in eBird' : 'Open in eBird' }}
                </a>
              </div>
            </div>
          </MapboxPopup>
          <MapboxCluster
            v-if="hotspot.length > 0"
            :data="hotspotGeojson"
            :clusterRadius="30"
            :clustersPaint="{
              'circle-color': HOTSPOT_COLOR,
              'circle-radius': 20,
            }"
            :unclusteredPointPaint="{ 'circle-color': HOTSPOT_COLOR, 'circle-radius': 10 }"
            @mb-feature-click="openPopup"
          />
          <MapboxCluster
            v-else-if="myLocation.length > 0"
            :data="myLocationGeojson"
            :clusterRadius="30"
            :clustersPaint="{
              'circle-color': PERSONAL_LOCATION_COLOR,
              'circle-radius': 20,
            }"
            :unclusteredPointPaint="{ 'circle-color': PERSONAL_LOCATION_COLOR, 'circle-radius': 10 }"
            @mb-feature-click="openPopup"
          />
          <MapboxMarker
            v-for="m in myPersonalLocation"
            :key="m.locId"
            :lng-lat="[m.lng, m.lat]"
            :color="PERSONAL_LOCATION_COLOR"
            :popup="{
              closeButton: false,
              className: 'm2h-mapbox-popup m2h-mapbox-popup--location',
              maxWidth: '19rem',
            }"
          >
            <template v-slot:popup>
              <div class="map-popup map-popup--location">
                <div class="map-popup__header">
                  <div class="map-popup__title">
                    <i class="bi bi-geo-alt-fill"></i>
                    <a :href="'https://ebird.org/hotspot/' + m.locId" target="_blank">
                      {{ m.locname }}
                    </a>
                  </div>
                </div>
                <div class="map-popup__chips">
                  <a :href="'https://ebird.org/mychecklists/' + m.locId" target="_blank">
                    <span class="badge rounded-pill text-bg-primary">
                      <i class="bi bi-card-checklist"></i>
                      {{ formatNb(m.subIdNb) }}
                    </span>
                  </a>
                  <span class="badge rounded-pill text-bg-secondary">
                    <i class="bi bi-pin-map-fill"></i>
                    {{ formatDistance(m.closestHotspot.dist) }}
                  </span>
                </div>
                <div class="map-popup__footer">
                  <a
                    :href="'https://ebird.org/mylocations/edit/' + m.locId"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary"
                  >
                    Edit location
                  </a>
                </div>
              </div>
            </template>
          </MapboxMarker>
        </MapboxMap>
      </div>
    </div>
  </div>
  <div
    class="modal fade modal-lg"
    id="modalInformation"
    tabindex="-1"
    aria-labelledby="modalInformationLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformationLabel">Information</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="info-hero">
            <div class="d-flex align-items-start justify-content-between gap-3">
              <div>
                <p class="info-kicker mb-1">Why it matters</p>
                <h5 class="mb-2">Hotspot-linked data is easier to analyze, merge, and reuse.</h5>
                <p class="mb-0">
                  eBird hotspot references make checklists easier to compare, merge, and analyze.
                  Merge2Hotspot converts personal locations into hotspot-linked records without
                  sending your file to a server.
                </p>
              </div>
              <span class="badge rounded-pill text-bg-light info-pill">3 steps</span>
            </div>
          </div>

          <p class="mb-3">
            The workflow is simple: import your export, download the regions you birded, and then
            review each remaining personal location against the nearest hotspot.
          </p>

          <div class="info-steps">
            <div class="info-step">
              <div class="info-step-index">1</div>
              <div>
                <h6 class="mb-1">Import</h6>
                <p class="mb-2">
                  Download your eBird export and upload <code>MyEBirdData.csv</code> below.
                </p>
                <a
                  role="button"
                  class="btn btn-primary btn-sm"
                  href="https://ebird.org/downloadMyData"
                  target="_blank"
                >
                  Get the file
                </a>
              </div>
            </div>

            <div class="info-step">
              <div class="info-step-index">2</div>
              <div>
                <h6 class="mb-1">Load hotspots</h6>
                <p class="mb-0">
                  Download the regions you birded. The badge shows how many personal locations are
                  in each region.
                </p>
              </div>
            </div>

            <div class="info-step">
              <div class="info-step-index">3</div>
              <div>
                <h6 class="mb-1">Merge</h6>
                <p class="mb-0">
                  Review the remaining personal locations, check the nearest hotspot, and open the
                  eBird merge or edit link as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";
import { nextTick } from "vue";

import { EBIRD_API_KEY, MAPBOX_ACCESS_TOKEN } from "./config";
import {
  buildFeatureCollection,
  buildMyLocations,
  buildPersonalLocations,
  formatDistance,
  mergeByLocId,
  normalizeHotspots,
  parseMyEBirdCsv,
  sortPersonalLocations,
  summarizeRegions,
} from "./lib/ebird";
import { loadRegions } from "./lib/regions";

const MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v11";
const HOTSPOT_COLOR = "#e63433";
const PERSONAL_LOCATION_COLOR = "#468cb9";

export default {
  data() {
    return {
      map: null,
      popupIsOpen: false,
      popupPosition: [0, 0],
      popupLoc: {},
      popupVariant: "hotspot",
      myLocation: [],
      loadingMyeBirdDataStatus: null,
      hotspot: [],
      region: [],
      filterList: "distance",
      tabButtons: [],
      tabResizeHandler: null,
      mapboxAccessToken: MAPBOX_ACCESS_TOKEN,
      mapStyle: MAPBOX_STYLE,
    };
  },
  computed: {
    step() {
      return 1 + (this.myLocation.length > 0) + (this.hotspot.length > 0);
    },
    myPersonalLocation() {
      const downloadedRegionCodes = this.region
        .filter((region) => region.status === "downloaded")
        .map((region) => region.code);

      return buildPersonalLocations(this.myLocation, this.hotspot, downloadedRegionCodes);
    },
    myPersonalLocationSorted() {
      return sortPersonalLocations(this.myPersonalLocation, this.filterList);
    },
    myLocationGeojson() {
      return buildFeatureCollection(this.myLocation, "location");
    },
    hotspotGeojson() {
      return buildFeatureCollection(this.hotspot, "hotspot");
    },
    popupTitle() {
      return this.popupLoc.locName ?? this.popupLoc.locname ?? "Location";
    },
    popupLocationChecklistCount() {
      return this.popupLoc.checklistCount ?? this.popupLoc.subIdNb ?? this.popupLoc.subId?.length ?? 0;
    },
  },
  methods: {
    formatNb(x) {
      const value = Number(x);
      if (!Number.isFinite(value)) {
        return "0";
      }

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    regionActionClass(status) {
      if (status === null) {
        return "btn-outline-primary";
      }

      if (status === "loading") {
        return "btn-warning";
      }

      if (status === "downloaded") {
        return "btn-success";
      }

      return "btn-danger";
    },
    processMyeBirdDataFile(event) {
      const file = event.target.files?.[0];
      if (!file) {
        this.loadingMyeBirdDataStatus = null;
        return;
      }

      this.loadingMyeBirdDataStatus = 0;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = String(e.target.result ?? "");
          const parsedRows = parseMyEBirdCsv(csvText);
          this.myLocation = buildMyLocations(parsedRows);
          this.loadingMyeBirdDataStatus = 1;
          this.region = summarizeRegions(this.region, this.myLocation);
          this.fitMap(this.myLocation);
        } catch (error) {
          console.error(error);
          this.loadingMyeBirdDataStatus = -1;
        }
      };
      reader.onerror = (error) => {
        console.error(error);
        this.loadingMyeBirdDataStatus = -1;
      };
      reader.readAsText(file);
    },
    navTabActivate(label) {
      const tab = document.querySelector(`#mainTab .nav-item #${label}-tab`);
      if (tab) {
        new bootstrap.Tab(tab).show();
      }
    },
    reloadMap() {
      this.map?.resize?.();
    },
    handleMapCreated(mapInstance) {
      this.map = mapInstance;

      if (this.myLocation.length === 0 && this.hotspot.length === 0) {
        this.map.fitBounds(
          [
            [-170, -55],
            [170, 75],
          ],
          {
            padding: 32,
            duration: 0,
          }
        );
      }
    },
    attachTabListeners() {
      this.tabButtons = Array.from(document.querySelectorAll('#mainTab [data-bs-toggle="tab"]'));
      this.tabButtons.forEach((tabButton) => {
        tabButton.addEventListener("shown.bs.tab", this.tabResizeHandler);
      });
    },
    detachTabListeners() {
      this.tabButtons.forEach((tabButton) => {
        tabButton.removeEventListener("shown.bs.tab", this.tabResizeHandler);
      });
      this.tabButtons = [];
    },
    async downloadRegion(region) {
      region.status = "loading";
      try {
        const response = await fetch(
          `https://ebird.org/ws2.0/ref/hotspot/${region.code}?fmt=json&key=${EBIRD_API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`Failed to load hotspots for ${region.code}: ${response.status}`);
        }

        const json = await response.json();
        const hotspots = normalizeHotspots(json);
        this.hotspot = mergeByLocId(this.hotspot, hotspots);
        region.status = "downloaded";

        const hotspotLocIds = new Set(hotspots.map((hotspot) => hotspot.locId));
        region.locPerNb = this.myLocation.filter(
          (location) => region.code === location.region && !hotspotLocIds.has(location.locId)
        ).length;

        this.fitMap(this.hotspot);
      } catch (error) {
        console.error(error);
        region.status = "error";
      }
    },
    fitMap(l) {
      if (!this.map || l.length === 0) {
        return;
      }

      this.map.fitBounds(
        l.reduce(
          (p, e) => [
            [Math.min(p[0][0], e.lng), Math.min(p[0][1], e.lat)],
            [Math.max(p[1][0], e.lng), Math.max(p[1][1], e.lat)],
          ],
          [
            [180, 90],
            [-180, -90],
          ]
        )
      );
    },
    async openPopup({ geometry, properties }) {
      await nextTick();
      this.popupPosition = [...geometry.coordinates];
      this.popupIsOpen = true;
      this.popupLoc = properties;
      this.popupVariant = properties?.kind === "hotspot" ? "hotspot" : "location";
    },
  },
  async mounted() {
    this.tabResizeHandler = () => this.reloadMap();
    this.attachTabListeners();

    try {
      this.region = await loadRegions(EBIRD_API_KEY);
      this.region = summarizeRegions(this.region, this.myLocation);
    } catch (error) {
      console.error(error);
      this.region = [];
    }
  },
  beforeUnmount() {
    this.detachTabListeners();
  },
};
</script>
