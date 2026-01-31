// social-link.vo.ts

import { ValueObject } from "src/shared/domain/value-objects";

export type SocialPlatform = 'facebook' | 'line' | 'whatsapp';

interface SocialLinkProps {
  platform: SocialPlatform;
  value: string;
}

export class SocialLink extends ValueObject<SocialLinkProps> {
  private constructor(props: SocialLinkProps) {
    super(props);
  }

  static create(platform: SocialPlatform, link: string): SocialLink {
    if (!link || link.trim().length === 0) {
      throw new Error('Social link is required');
    }
    return new SocialLink({ platform, value: link.trim() });
  }

  get platform(): SocialPlatform {
    return this.props.platform;
  }

  get value(): string {
    return this.props.value;
  }
}
