# Content Licensing Documentation

This document outlines all third-party content used in CalmSync and their respective licenses, ensuring legal compliance and proper attribution.

## Overview

CalmSync uses curated, commercially-safe content from various sources to provide relaxation experiences. All content is either:
- Public domain
- Licensed under Creative Commons (CC BY, CC0)
- Properly licensed for commercial use
- Self-created and owned by CalmSync

## Content Categories

### 1. Music

All music tracks used in CalmSync are sourced from royalty-free or Creative Commons licensed repositories.

#### Current Sources:
- **Free Music Archive (FMA)**: CC BY, CC BY-SA, CC0 licensed tracks
- **Incompetech**: CC BY 3.0 licensed instrumental tracks
- **YouTube Audio Library**: Royalty-free music for commercial use

**Attribution Requirements:**
- Track title, artist name, and license type are stored in the `ContentItem` table
- Attribution is displayed in the experience view when required by license
- Full license texts are available in `/licenses/music/`

### 2. Nature Videos

Nature videos provide visual relaxation content, including landscapes, oceans, forests, and wildlife.

#### Current Sources:
- **Pexels Videos**: Free to use for commercial and non-commercial purposes (Pexels License)
- **Pixabay Videos**: CC0 (public domain) license
- **Videvo**: Royalty-free videos with attribution when required

**Attribution Requirements:**
- Video creator and source URL stored in `ContentItem.description`
- Attribution provided when required by the license
- All videos are downloaded and hosted locally to ensure availability

### 3. Nature Sounds

Ambient nature sounds (rain, ocean waves, forest ambiance, etc.) enhance the relaxation experience.

#### Current Sources:
- **Freesound.org**: CC BY, CC0 licensed sound effects
- **Zapsplat**: Royalty-free sound effects for commercial use
- **BBC Sound Effects**: RemArc license (free for educational/research purposes)

**Attribution Requirements:**
- Sound creator and license stored in database
- Attribution displayed when required by CC BY licenses
- Full license compliance documented

### 4. Images

Background images and visual elements for breathing exercises and calming displays.

#### Current Sources:
- **Unsplash**: Free to use (Unsplash License)
- **Pexels**: Free to use (Pexels License)
- **Pixabay**: CC0 (public domain)

**Attribution Requirements:**
- Photographer name and source stored in `ContentItem` metadata
- Attribution provided when encouraged by platform terms
- All images optimized and hosted locally

### 5. Text Content

Guided prompts, affirmations, and breathing instructions.

**Source:**
- All text content is created in-house by CalmSync
- Based on evidence-based relaxation techniques from public domain research
- No external licensing required

### 6. Breathing Animations

Visual animations for guided breathing exercises.

**Source:**
- Custom-built CSS/JavaScript animations
- Created in-house, no third-party dependencies
- Open source libraries used: React (MIT License)

## License Types Used

### Creative Commons Zero (CC0)
- **Permissions**: Public domain, no attribution required
- **Commercial Use**: Allowed
- **Modifications**: Allowed
- **Used for**: Selected music tracks, sounds, and images

### Creative Commons Attribution (CC BY)
- **Permissions**: Use, modify, distribute with attribution
- **Commercial Use**: Allowed
- **Attribution**: Required (creator name, license, link)
- **Used for**: Music tracks, nature sounds, some videos

### Creative Commons Attribution-ShareAlike (CC BY-SA)
- **Permissions**: Use, modify, distribute with attribution
- **Commercial Use**: Allowed
- **Attribution**: Required
- **ShareAlike**: Derivative works must use same license
- **Used for**: Selected music tracks

### Pexels License
- **Permissions**: Free for commercial and non-commercial use
- **Attribution**: Not required but appreciated
- **Modifications**: Allowed
- **Restrictions**: Cannot sell as-is, cannot use in competing platforms
- **Used for**: Photos and videos from Pexels

### Unsplash License
- **Permissions**: Free for commercial and non-commercial use
- **Attribution**: Not required but appreciated
- **Modifications**: Allowed
- **Restrictions**: Cannot compile photos to replicate Unsplash
- **Used for**: Photos from Unsplash

## Implementation in CalmSync

### Database Schema

The `ContentItem` model includes licensing metadata:

```typescript
model ContentItem {
  id          String      @id @default(cuid())
  type        ContentType
  title       String
  url         String?
  content     String?     // For text content
  description String?     // Includes attribution and license info
  feeling     FeelingType
  tags        String[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### License Metadata Format

For content requiring attribution, the `description` field uses this JSON format:

```json
{
  "description": "Ocean waves at sunset",
  "license": {
    "type": "CC BY 3.0",
    "source": "Freesound.org",
    "author": "John Doe",
    "url": "https://freesound.org/...",
    "attribution": "Ocean Waves by John Doe / CC BY 3.0"
  }
}
```

### Attribution Display

When content with attribution requirements is used:
1. Attribution is displayed in the experience footer
2. Format: "{Title} by {Author} / {License}"
3. Links to original source and license text provided

## Compliance Checklist

- [x] All content sources documented
- [x] License types verified for commercial use
- [x] Attribution requirements identified
- [x] Database schema supports license metadata
- [x] UI displays attribution when required
- [x] Content hosted locally to prevent link rot
- [x] License texts available in `/licenses/` directory
- [x] Annual license review scheduled

## Content Acquisition Process

When adding new content to CalmSync:

1. **Verify License**: Ensure commercial use is allowed
2. **Document Source**: Record original URL and license
3. **Store Metadata**: Add license info to database
4. **Download/Host**: Store content locally (don't rely on external links)
5. **Implement Attribution**: Display required attribution in UI
6. **Test Display**: Verify attribution shows correctly
7. **Update This Doc**: Add source to appropriate section above

## Regular Audits

Content licensing is reviewed:
- **Monthly**: New content additions
- **Quarterly**: Sample audit of existing content
- **Annually**: Full content library review
- **On License Change**: When source platforms update terms

## Contact & Questions

For questions about content licensing:
- **Email**: legal@calmsync.app
- **Documentation Owner**: Engineering Team
- **Last Review**: November 26, 2025
- **Next Review**: February 26, 2026

## Legal Disclaimer

CalmSync makes reasonable efforts to ensure all content is properly licensed and attributed. If you believe any content infringes on your copyright, please contact us immediately at legal@calmsync.app with:
- Description of the copyrighted work
- Location of the content in CalmSync
- Your contact information
- Good faith statement of unauthorized use

We will promptly investigate and remove infringing content.

## License Text References

Full license texts are available at:
- CC0: https://creativecommons.org/publicdomain/zero/1.0/
- CC BY 3.0: https://creativecommons.org/licenses/by/3.0/
- CC BY-SA 3.0: https://creativecommons.org/licenses/by-sa/3.0/
- Pexels: https://www.pexels.com/license/
- Unsplash: https://unsplash.com/license

---

*This document is maintained as part of CalmSync's legal compliance efforts and is updated regularly to reflect the current content library.*

