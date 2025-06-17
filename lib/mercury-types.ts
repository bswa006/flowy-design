export interface Point {
  x: number;
  y: number;
}

export interface DragItem {
  id: string;
  type: "search-result" | "action-card" | "content-block";
  data: any;
  sourceContext: string;
  previewComponent?: React.ComponentType<any>;
}

export interface DropResult {
  targetId: string;
  targetType: "flow-canvas" | "card-stack" | "connection-point";
  position: Point;
  action: "create-card" | "add-to-existing" | "create-connection";
}

export type FocusLevel = "focused" | "ambient" | "fog";

export type CardType =
  | "housing-listing"
  | "location-info"
  | "content-block"
  | "action-result";

export interface CardContent {
  title: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  metadata: Record<string, any>;
}

export interface CardMetadata {
  sourceType?: string;
  sourceContext?: string;
  createdAt?: number;
  lastFocused?: number;
  [key: string]: any;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: "related" | "derived" | "sequential";
  strength: number;
  visualStyle?: ConnectionStyle;
}

export interface ConnectionStyle {
  color: string;
  thickness: number;
  dashPattern?: number[];
  animation?: "pulse" | "flow" | "static";
}

export interface MercuryCard {
  id: string;
  type: CardType;
  position: Point;
  content: CardContent;
  connections: Connection[];
  focusLevel: FocusLevel;
  intent: string;
  metadata: CardMetadata;
}

// Existing apartment listing interface (extend existing)
export interface ApartmentListing {
  id: string;
  bedrooms: string;
  bathrooms: string;
  name: string;
  price: string;
  image: string;
  isLiked?: boolean;
}

// Context detection types
export interface Entity {
  text: string;
  type: "location" | "price" | "category" | "time";
  confidence: number;
  position: [number, number]; // text positions
}

export interface ContextTrigger {
  type: "housing" | "travel" | "shopping" | "dining" | "general";
  entities: Entity[];
  confidence: number;
  suggestedActions: ContextualAction[];
  location?: string;
}

export interface ContextualAction {
  id: string;
  title: string;
  description: string;
  type: "search" | "navigate" | "create" | "contact";
  confidence: number;
  dataRequirements: string[];
  expectedResults: string[];
}
