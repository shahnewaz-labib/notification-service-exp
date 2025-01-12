export interface Provider {
  url: string;
  name: string;
  consume(data: any): Promise<void>;
}
