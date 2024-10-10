import L, { LatLngExpression } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import styled from 'styled-components';

import { Div, Text } from '@components/index';
import { flex, font } from '@src/styles/variables';

interface MapChartProps {
  title: string;
  width?: string;
  height?: string;
}

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  //   iconAnchor: [12, 41], // Icon 클릭시 popUp 위치 조정 가능
});

const Container = styled(Div)`
  ${flex({ direction: 'column', align: '' })};
  --padding: 32px;
  padding: var(--padding);
  height: 100%;
`;

const Title = styled(Text)`
  ${font({ size: '20px', weight: '700' })};
  line-height: 1.17;
  margin-bottom: 15px;
`;

L.Marker.prototype.options.icon = DefaultIcon;

const MapChart = ({ title, height = '100vh', width = '100%' }: MapChartProps) => {
  const position: LatLngExpression = [51.505, -0.09];

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer center={position} zoom={3} scrollWheelZoom style={{ height, width }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          noWrap
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Container>
  );
};

export default MapChart;
