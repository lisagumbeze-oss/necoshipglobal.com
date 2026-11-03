"use client";

import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Button } from "@/components/design-system/ui";
type ShipmentRecord = {
  id: string;
  origin: string;
  destination: string;
  status: string;
  eta: string;
  recipient: string;
  service?: string;
  weightKg?: number;
  costUsd?: number;
  updatedAt?: string;
};

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, color: "#0B1F3A" },
  heading: { fontSize: 18, marginBottom: 10 },
  block: { marginBottom: 8, padding: 8, border: "1 solid #CBD5E1", borderRadius: 4 },
  key: { fontSize: 10, color: "#475569" },
  value: { fontSize: 12, marginTop: 2 }
});

function SummaryDoc({ shipment }: { shipment: ShipmentRecord }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>NecoShip Tracking Summary</Text>

        <View style={styles.block}>
          <Text style={styles.key}>Tracking Number</Text>
          <Text style={styles.value}>{shipment.id}</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.key}>Route</Text>
          <Text style={styles.value}>
            {shipment.origin} {"->"} {shipment.destination}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.key}>Status</Text>
          <Text style={styles.value}>{shipment.status}</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.key}>ETA</Text>
          <Text style={styles.value}>{shipment.eta}</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.key}>Recipient</Text>
          <Text style={styles.value}>{shipment.recipient}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function TrackingSummaryPDFButton({ shipment }: { shipment: ShipmentRecord | null }) {
  if (!shipment) {
    return (
      <Button className="w-full" type="button" disabled>
        Download PDF Summary
      </Button>
    );
  }

  return (
    <PDFDownloadLink document={<SummaryDoc shipment={shipment} />} fileName={`${shipment.id}-summary.pdf`}>
      {({ loading }) => (
        <Button className="w-full" type="button" disabled={loading}>
          {loading ? "Preparing PDF..." : "Download PDF Summary"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
