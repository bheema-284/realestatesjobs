"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import * as turf from '@turf/turf';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';



const DrawControl = ({ onDrawStart, onCreate, onDelete, drawnItemsRef }) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    // No icons shown
    const drawControl = new L.Control.Draw({
      draw: false,
      edit: false,
    });
    map.addControl(drawControl);

    const handler = (e) => {
      drawnItems.addLayer(e.layer);
      onCreate(e.layer);
    };
    map.on(L.Draw.Event.CREATED, handler);
    map.on(L.Draw.Event.DELETED, onDelete);

    onDrawStart((options = {}, partitionIndex = null) => {
      const drawPolygon = new L.Draw.Polygon(map, {
        shapeOptions: {
          color: partitionIndex !== null ? 'green' : '#3388ff',
          weight: 2,
          ...options,
        },
      });

      drawPolygon.enable();

      if (partitionIndex !== null) {
        setActivePartitionClusterIndex(partitionIndex);
      }
    });



    return () => {
      map.off(L.Draw.Event.CREATED, handler);
      map.off(L.Draw.Event.DELETED, onDelete);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onDrawStart, onCreate, onDelete, drawnItemsRef]);

  return null;
};

const Vendor = () => {
  const [clusters, setClusters] = useState([]);
  const [newClusterData, setNewClusterData] = useState({
    name: "",
    city: "",
    area: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [drawingForPartitionIndex, setDrawingForPartitionIndex] = useState(null);
  const [newPartitionData, setNewPartitionData] = useState({
    name: '',
    city: '',
    area: '',
    layer: null,
  });
  const [editingPartitionIndex, setEditingPartitionIndex] = useState(null);

  const partitionSubmitRef = useRef(false);

  const nameInputRef = useRef(null);

  const mapRef = useRef();
  const drawnItemsRef = useRef(new L.FeatureGroup());


  const handleCreate = (layer) => {
    const rawLatLngs = layer.getLatLngs()[0];
    const latlngs = rawLatLngs.map(p => [p.lng, p.lat]);
    const closedLatLngs = [...latlngs, latlngs[0]];
    const newPolygon = turf.polygon([closedLatLngs]);
    const area = turf.area(newPolygon) / 1e6;

    // ✅ CASE 1: Drawing a partition
    if (drawingForPartitionIndex !== null) {
      const targetCluster = clusters[drawingForPartitionIndex];
      const targetLatlngs = targetCluster.latlngs.map(p => [p.lng, p.lat]);
      const closedTarget = [...targetLatlngs, targetLatlngs[0]];
      const targetPolygon = turf.polygon([closedTarget]);

      if (!turf.booleanWithin(newPolygon, targetPolygon)) {
        alert("Partition must be completely inside the selected cluster.");
        drawnItemsRef.current.removeLayer(layer);
        return;
      }

      for (let i = 0; i < clusters.length; i++) {
        if (i === drawingForPartitionIndex) continue;

        const other = clusters[i];
        const otherLatlngs = other.latlngs.map(p => [p.lng, p.lat]);
        const closedOther = [...otherLatlngs, otherLatlngs[0]];
        const otherPolygon = turf.polygon([closedOther]);

        if (turf.booleanIntersects(newPolygon, otherPolygon)) {
          alert("Partition intersects another cluster.");
          drawnItemsRef.current.removeLayer(layer);
          return;
        }
      }

      const existingPartitions = targetCluster.partitions || [];
      for (const part of existingPartitions) {
        const partLatlngs = part.latlngs.map(p => [p.lng, p.lat]);
        const closedPart = [...partLatlngs, partLatlngs[0]];
        const partPolygon = turf.polygon([closedPart]);

        if (
          turf.booleanIntersects(newPolygon, partPolygon) ||
          turf.booleanContains(newPolygon, partPolygon) ||
          turf.booleanContains(partPolygon, newPolygon)
        ) {
          alert("This partition overlaps with another partition in the same cluster.");
          drawnItemsRef.current.removeLayer(layer);
          return;
        }
      }

      // ✅ SHOW the form by updating newPartitionData
      const formattedLatlngs = rawLatLngs.map((p) => ({ lat: p.lat, lng: p.lng }));
      setNewPartitionData({
        name: '',
        city: '',
        area: area.toFixed(2),
        layer,
        latlngs: formattedLatlngs,
      });

      return;
    }


    // ✅ CASE 2: Drawing a main cluster
    for (const existing of clusters) {
      const existingLatlngs = existing.latlngs.map(p => [p.lng, p.lat]);
      const closedExisting = [...existingLatlngs, existingLatlngs[0]];
      const existingPolygon = turf.polygon([closedExisting]);

      if (
        turf.booleanIntersects(newPolygon, existingPolygon) ||
        turf.booleanContains(newPolygon, existingPolygon) ||
        turf.booleanContains(existingPolygon, newPolygon)
      ) {
        alert('This cluster overlaps with an existing cluster.');
        drawnItemsRef.current.removeLayer(layer);
        return;
      }
    }

    if (drawingForPartitionIndex !== null) {
      const formattedLatlngs = rawLatLngs.map((p) => ({ lat: p.lat, lng: p.lng }));
      setNewPartitionData({
        name: '',
        city: '',
        area: area.toFixed(2),
        layer,
        latlngs: formattedLatlngs,
      });
      return;
    }


    // ✅ Save new cluster
    setNewClusterData({ layer, rawLatLngs, area: area.toFixed(2) });
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 0);
    setTimeout(() => {
      const input = document.querySelector("#partitionNameInput");
      if (input) input.focus();
    }, 0);
  };


  const handlePartitionSubmit = (e) => {
    e.preventDefault();

    partitionSubmitRef.current = false; // ✅ Always allow submit

    if (!newPartitionData || !newPartitionData.layer) return;

    const { name, city, layer } = newPartitionData;
    if (!name || !city || !layer) return;

    const updatedLatLngs = layer.getLatLngs()[0]; // ✅ get latest polygon
    const latlngs = updatedLatLngs.map(p => [p.lng, p.lat]);
    const closedLatLngs = [...latlngs, latlngs[0]];
    const updatedPolygon = turf.polygon([closedLatLngs]);
    const updatedArea = (turf.area(updatedPolygon) / 1e6).toFixed(2);

    const formattedLatlngs = updatedLatLngs.map(p => ({ lat: p.lat, lng: p.lng }));

    setClusters((prev) => {
      const updated = [...prev];
      const cluster = updated[drawingForPartitionIndex];

      if (!cluster.partitions) cluster.partitions = [];

      if (editingPartitionIndex !== null) {
        const targetPartition = cluster.partitions[editingPartitionIndex];
        if (targetPartition) {
          targetPartition.name = name;
          targetPartition.city = city;
          targetPartition.area = updatedArea;
          targetPartition.latlngs = formattedLatlngs;

          if (targetPartition.layer) {
            targetPartition.layer.setLatLngs([updatedLatLngs]);
            targetPartition.layer.editing?.disable();
          }
        }
      } else {
        const alreadyExists = cluster.partitions.some(part =>
          JSON.stringify(part.latlngs) === JSON.stringify(formattedLatlngs)
        );
        if (alreadyExists) return prev;

        cluster.partitions.push({
          id: Date.now(),
          name,
          city,
          area: updatedArea,
          latlngs: formattedLatlngs,
          layer,
        });
      }

      return updated;
    });

    // Reset all state
    setNewPartitionData({ name: '', city: '', area: '', layer: null, latlngs: [] });
    setDrawingForPartitionIndex(null);
    setEditingPartitionIndex(null);
  };





  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const city = form.city.value;
    const { layer } = newClusterData;

    if (!layer || !name || !city) return;

    // Extract updated coordinates and calculate area
    const rawLatLngs = layer.getLatLngs()[0];
    const latlngs = rawLatLngs.map((p) => [p.lng, p.lat]);
    const closedLatLngs = [...latlngs, latlngs[0]];
    const newPolygon = turf.polygon([closedLatLngs]);

    const area = (turf.area(newPolygon) / 1e6).toFixed(2);
    const formattedLatlngs = rawLatLngs.map((p) => ({ lat: p.lat, lng: p.lng }));

    if (editingIndex !== null) {
      // 1. Remove old layer from map
      const oldLayer = clusters[editingIndex]?.layer;
      if (oldLayer && drawnItemsRef.current.hasLayer(oldLayer)) {
        drawnItemsRef.current.removeLayer(oldLayer);
      }

      // 2. Add new edited layer to map
      drawnItemsRef.current.addLayer(layer);
      layer.editing?.disable();

      // 3. Replace cluster in state
      const updatedClusters = [...clusters];
      updatedClusters[editingIndex] = {
        ...updatedClusters[editingIndex],
        name,
        city,
        area,
        latlngs: formattedLatlngs,
        layer,
      };

      setClusters(updatedClusters);
      setEditingIndex(null);
    } else {
      // Creating new cluster
      const id = Date.now();
      layer.options.clusterId = id;
      drawnItemsRef.current.addLayer(layer);

      setClusters((prev) => [
        ...prev,
        { id, name, city, area, latlngs: formattedLatlngs, layer },
      ]);
    }

    setNewClusterData({ name: "", city: "", area: "", layer: null });
  };




  const handleDelete = (index) => {
  const updated = [...clusters];
  const clusterToDelete = updated[index];

  if (clusterToDelete) {
    // Remove the cluster layer
    if (clusterToDelete.layer && drawnItemsRef.current) {
      drawnItemsRef.current.removeLayer(clusterToDelete.layer);
    }

    // Remove all partition layers associated with this cluster
    if (Array.isArray(clusterToDelete.partitions)) {
      clusterToDelete.partitions.forEach((partition) => {
        if (partition.layer && drawnItemsRef.current) {
          drawnItemsRef.current.removeLayer(partition.layer);
        }
      });
    }
  }

  // Remove from state
  updated.splice(index, 1);
  setClusters(updated);
};



  const handleEdit = (index) => {
    const clusterToEdit = clusters[index];
    const { layer, name, city, area, latlngs } = clusterToEdit;

    if (layer && layer.editing) {
      layer.setStyle({
        color: 'blue',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.2,
      });
      layer.bringToFront();   // <-- Make sure it's on top
      layer.editing.enable();


      layer.on('edit', () => {
        const updatedLatLngs = layer.getLatLngs()[0];

        if (updatedLatLngs.length < 3) {
          alert('A valid polygon must have at least 3 points.');
          layer.setLatLngs(originalLatLngs); // revert
          layer.editing.disable();
          layer.editing.enable(); // re-enable edit
          return;
        }

        const updatedCoords = updatedLatLngs.map((p) => [p.lng, p.lat]);
        const closedCoords = [...updatedCoords, updatedCoords[0]];
        const updatedPolygon = turf.polygon([closedCoords]);

        // Check for intersection with other clusters (excluding itself)
        for (let i = 0; i < clusters.length; i++) {
          if (i === index) continue;
          const other = clusters[i];
          const otherCoords = other.latlngs.map((p) => [p.lng, p.lat]);
          const otherClosed = [...otherCoords, otherCoords[0]];
          const otherPolygon = turf.polygon([otherClosed]);

          if (
            turf.booleanIntersects(updatedPolygon, otherPolygon) ||
            turf.booleanContains(updatedPolygon, otherPolygon) ||
            turf.booleanContains(otherPolygon, updatedPolygon)
          ) {
            alert('This edit causes overlap with another cluster. Edit canceled.');
            layer.setLatLngs(originalLatLngs); // revert
            layer.editing.disable();
            layer.editing.enable(); // re-enable to retry
            return;
          }
        }

        const updatedArea = (turf.area(updatedPolygon) / 1e6).toFixed(2);
        setNewClusterData((prev) => ({
          ...prev,
          area: updatedArea,
          rawLatLngs: updatedLatLngs,
        }));
      });

      setEditingIndex(index);
      setNewClusterData({ name, city, area, layer, rawLatLngs: latlngs });
    }
  };
  const drawStartRef = useRef(null);

  const handleDrawClick = () => {
    // setDrawingForPartitionIndex(null); // Drawing a new cluster
    if (drawStartRef.current) drawStartRef.current();
  };

  const handlePartitionDrawClick = (clusterIndex) => {
    setDrawingForPartitionIndex(clusterIndex); // Drawing a partition
    if (drawStartRef.current) drawStartRef.current();
  };

  const handlePartitionEdit = (clusterIndex, partitionIndex) => {
    partitionSubmitRef.current = false; // ✅ Reset submit flag

    const partition = clusters[clusterIndex].partitions[partitionIndex];
    if (!partition?.layer) return;

    const layer = partition.layer;

    // Add to map if not already
    if (!drawnItemsRef.current.hasLayer(layer)) {
      drawnItemsRef.current.addLayer(layer);
    }

    // Set style and bring to front
    layer.setStyle({
      color: 'green',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.2,
    });
    layer.bringToFront();

    // Enable editing
    layer.editing.enable();

    const originalLatLngs = layer.getLatLngs()[0].map(p => ({ lat: p.lat, lng: p.lng }));

    // Define the edit handler
    const onEdit = () => {
      const updatedLatLngs = layer.getLatLngs()[0];
      const updatedCoords = updatedLatLngs.map((p) => [p.lng, p.lat]);
      const closedCoords = [...updatedCoords, updatedCoords[0]];
      const updatedPolygon = turf.polygon([closedCoords]);

      if (updatedLatLngs.length < 3) {
        alert('A polygon must have at least 3 points.');
        layer.setLatLngs([originalLatLngs.map(p => L.latLng(p.lat, p.lng))]);
        return;
      }

      const updatedArea = (turf.area(updatedPolygon) / 1e6).toFixed(2);
      const formatted = updatedLatLngs.map((p) => ({ lat: p.lat, lng: p.lng }));

      setClusters(prev => {
        const updated = [...prev];
        updated[clusterIndex].partitions[partitionIndex] = {
          ...updated[clusterIndex].partitions[partitionIndex],
          latlngs: formatted,
          area: updatedArea,
        };
        return updated;
      });

      setNewPartitionData(prev => ({
        ...prev,
        latlngs: formatted,
        area: updatedArea,
      }));
    };

    layer.off('edit');
    layer.on('edit', onEdit);

    const updatedLatLngs = layer.getLatLngs()[0];
    const updatedCoords = updatedLatLngs.map((p) => [p.lng, p.lat]);
    const closedCoords = [...updatedCoords, updatedCoords[0]];
    const updatedPolygon = turf.polygon([closedCoords]);
    const updatedArea = (turf.area(updatedPolygon) / 1e6).toFixed(2);
    const formatted = updatedLatLngs.map((p) => ({ lat: p.lat, lng: p.lng }));

    setNewPartitionData({
      name: partition.name,
      city: partition.city,
      area: updatedArea,
      latlngs: formatted,
      layer,
    });

    setDrawingForPartitionIndex(clusterIndex);
    setEditingPartitionIndex(partitionIndex);
  };




  const handlePartitionDelete = (clusterIndex, partitionIndex) => {
    const updated = [...clusters];
    const targetCluster = updated[clusterIndex];

    const partitionToRemove = targetCluster.partitions[partitionIndex];

    // Remove the layer from map
    if (partitionToRemove.layer && drawnItemsRef.current.hasLayer(partitionToRemove.layer)) {
      drawnItemsRef.current.removeLayer(partitionToRemove.layer);
    }

    // Remove from state
    targetCluster.partitions.splice(partitionIndex, 1);
    setClusters(updated);
  };


  return (
    <div className='flex flex-col sm:flex-row gap-5 justify-between p-5'>
      <div>
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Add Cluster</h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleDrawClick}
            >
              + Create Cluster
            </button>

          </div>

          <form
            onSubmit={handleFormSubmit}
            className="w-full flex flex-col sm:flex-row gap-5 bg-white p-6 rounded-lg shadow-lg w-full items-center"
          >
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                className="mt-1 p-2 block w-full border rounded"
                required
                value={newClusterData.name}
                ref={nameInputRef}
                onChange={(e) =>
                  setNewClusterData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                name="city"
                className="mt-1 p-2 block w-full border rounded"
                required
                value={newClusterData.city}
                onChange={(e) =>
                  setNewClusterData((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Area (sq. km)</label>
              <input
                name="area"
                className="mt-1 p-2 block w-full border rounded "
                value={newClusterData?.area}
                readOnly
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (newClusterData.layer && drawnItemsRef.current) {
                    drawnItemsRef.current.removeLayer(newClusterData.layer);
                  }
                  setNewClusterData({ name: "", city: "", area: "", layer: null });
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>

          {drawingForPartitionIndex !== null && newPartitionData.layer && (
            <form
              onSubmit={handlePartitionSubmit}
              className="bg-white p-4 my-4 rounded shadow flex flex-wrap gap-4 items-center"
            >
              <h3 className="w-full font-semibold text-blue-600">
                Add Partition to Cluster: {clusters[drawingForPartitionIndex]?.name}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">Partition Name</label>
                <input
                  id="partitionNameInput"
                  required
                  className="p-2 border rounded w-full"
                  value={newPartitionData.name}
                  onChange={(e) =>
                    setNewPartitionData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  required
                  className="p-2 border rounded w-full"
                  value={newPartitionData.city}
                  onChange={(e) =>
                    setNewPartitionData((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Area (sq. km)</label>
                <input
                  className="p-2 border rounded w-full"
                  value={newPartitionData.area}
                  readOnly
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (newPartitionData.layer) {
                      drawnItemsRef.current.removeLayer(newPartitionData.layer);
                    }
                    setNewPartitionData({ name: '', city: '', area: '', layer: null, latlngs: [] });
                    setDrawingForPartitionIndex(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Save Partition
                </button>
              </div>
            </form>
          )}

        </div>
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Drawn Clusters</h2>
          {(!clusters || clusters.length === 0) ? <p className='text-lg italic'>No Cluster Drawn Yet</p> : clusters.map((cluster, index) => (
            <div key={index} className="bg-white border border-blue-100 rounded-lg shadow-sm mb-6 p-4">
              {/* Cluster Info Header */}
              <div className="flex justify-between items-start border">
                <div className='flex gap-5 sm:items-center'>
                  <h3 className="text-md font-semibold text-gray-700">{index+1}. Cluster Name: <span className='text-lg font-bold text-blue-700 italic'>{cluster.name}</span> </h3>
                  <p className="text-sm text-gray-500">City: <span className='text-lg font-bold text-gray-700 italic'>{cluster.city}</span> </p>
                  <p className="text-sm text-gray-500">Area: <span className='text-lg font-bold text-gray-700 italic'>{cluster.area} km²</span>  </p>
                </div>
                <div className="flex gap-3 mt-1">
                  <PencilIcon
                    onClick={() => handleEdit(index)}
                    className="h-5 w-5 fill-yellow-500 hover:fill-yellow-700 cursor-pointer"
                  />
                  <TrashIcon
                    onClick={() => handleDelete(index)}
                    className="h-5 w-5 fill-red-500 hover:fill-red-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Partition Table */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Partitions</h4>
                {cluster.partitions && cluster.partitions.length > 0 ? (
                  <table className="min-w-full text-xs border border-gray-100">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">City</th>
                        <th className="p-2 text-left">Area (km²)</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cluster.partitions.map((part, pIndex) => (
                        <tr key={pIndex} className="border-t">
                          <td className="p-2">{part.name}</td>
                          <td className="p-2">{part.city}</td>
                          <td className="p-2">{part.area}</td>
                          <td className="p-2 flex gap-2">
                            <PencilIcon
                              onClick={() => handlePartitionEdit(index, pIndex)}
                              className="h-4 fill-yellow-500 hover:fill-yellow-700 cursor-pointer"
                            />
                            <TrashIcon
                              onClick={() => handlePartitionDelete(index, pIndex)}
                              className="h-4 fill-red-500 hover:fill-red-700 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs italic text-gray-400">No partitions added yet.</p>
                )}

                {/* Add Partition Button */}
                <button
                  onClick={() => handlePartitionDrawClick(index)}
                  className="mt-2 text-sm text-green-600 hover:underline"
                >
                  + Add Partition
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className='w-full sm:w-[40%]'>
        <MapContainer
          center={[17.3871, 78.49167]}
          zoom={7}
          style={{ height: '400px', width: '100%' }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <FeatureGroup>
            <DrawControl onDrawStart={(fn) => (drawStartRef.current = fn)} onCreate={handleCreate} onDelete={() => { }} drawnItemsRef={drawnItemsRef} />
          </FeatureGroup>
          {clusters.map((cluster, index) => (
            <React.Fragment key={index}>
              <Polygon
                positions={cluster.latlngs.map(p => [p.lat, p.lng])}
                pathOptions={{
                  color: drawingForPartitionIndex === index ? 'blue' : 'red',
                  fillOpacity: drawingForPartitionIndex === index ? 0.2 : 0.1,
                  weight: drawingForPartitionIndex === index ? 3 : 1,
                }}
              />

              {/* ✅ Render partitions in green */}
              {cluster.partitions?.map((partition, pIndex) => (
                <Polygon
                  key={`${index}-${pIndex}`}
                  positions={partition.latlngs.map(p => [p.lat, p.lng])}
                  pathOptions={{
                    color: 'green',
                    fillOpacity: 0.2,
                    weight: 1,
                  }}
                />
              ))}
            </React.Fragment>
          ))}

        </MapContainer>
      </div>
    </div>
  );
};

export default Vendor;
