import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request so TypeScript knows about tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId || tenantId.trim() === '') {
      res.status(400).json({ message: 'Tenant ID is required' });
      return;
    }

    req.tenantId = tenantId.trim(); // attach for downstream controllers
    next();
  }
}