export interface Provider {
  key: string;
  url: string;
  name: string;
  consume(data: any): Promise<void>;
}
