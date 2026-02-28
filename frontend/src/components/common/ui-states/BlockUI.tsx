import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

import { LoadingSwap } from '@/components/ui/loading-swap';

import EmptyState from '@/components/common/ui-states/EmptyState';
import ErrorState from '@/components/common/ui-states/ErrorState';

type StateOverrides = {
  empty?: ReactNode;
  error?: ReactNode;
  loading?: ReactNode;
};

type Props = {
  isLoading: boolean;
  isRefetching?: boolean;
  isError?: boolean | unknown;
  isEmpty?: boolean;
  emptyContent?: ReactNode;

  children: ReactNode;

  overrides?: StateOverrides;
  className?: string;
};

const BlockUI = ({
  isLoading,
  isRefetching,
  isError = false,
  isEmpty = false,
  emptyContent,
  children,
  overrides,
  className,
}: Props) => {
  if (isLoading) {
    return (
      <div className={cn('flex h-full w-full justify-center', className)}>
        {overrides?.loading ? (
          overrides.loading
        ) : (
          <LoadingSwap isLoading>{children}</LoadingSwap>
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex h-full w-full justify-center', className)}>
        {overrides?.error ? overrides.error : <ErrorState />}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn('flex h-full w-full justify-center', className)}>
        {overrides?.empty ? (
          overrides.empty
        ) : (
          <EmptyState title="No data found" content={emptyContent} />
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full', isRefetching && 'opacity-75', className)}>
      {children}
    </div>
  );
};

export default BlockUI;
