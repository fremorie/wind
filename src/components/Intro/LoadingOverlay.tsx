import { useLoadingProgress } from '../../hooks/useLoadingProgress';
import './LoadingOverlay.css';

export function LoadingOverlay({ isReady }: { isReady: boolean }) {
    const progress = useLoadingProgress();

    return (
        <div className={`loading ${isReady ? 'is-hidden' : ''}`}>
            <div className="loading__track">
                <div
                    className="loading__bar"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <span className="loading__percent">{Math.round(progress)}%</span>
        </div>
    );
}
