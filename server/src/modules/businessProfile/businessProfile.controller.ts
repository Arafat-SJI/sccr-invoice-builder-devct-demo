import { Response, NextFunction } from 'express';
import businessProfileService from './businessProfile.service';
import { upsertBusinessProfileSchema } from './businessProfile.validation';
import { AuthRequest } from '../auth/auth.types';

async function getBusinessProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const profile = await businessProfileService.getProfile(userId);
    return res.json({ profile });
  } catch (err) {
    return next(err);
  }
}

async function upsertBusinessProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const parseResult = upsertBusinessProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      return res.status(400).json({ message: 'Validation failed', errors: issues });
    }

    const profile = await businessProfileService.upsertProfile(userId, parseResult.data);
    return res.json({ profile });
  } catch (err) {
    return next(err);
  }
}

const businessProfileController = {
  getBusinessProfile,
  upsertBusinessProfile,
};

export default businessProfileController;
