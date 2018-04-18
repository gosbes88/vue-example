export default {
    methods: {
        getColor(progress) {
            switch (true) {
                case progress === 0:
                    return '#999';
                case progress < 20:
                    return '#b95455';
                case progress < 60:
                    return '#feae3b';
                case progress <= 100:
                    return '#8ccb4b';
                default:
                    return '#999';
            }
        }
    }
}